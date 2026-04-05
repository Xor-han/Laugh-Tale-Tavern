import { useState } from "react";
import { authClient } from "../lib/auth-client";
import {
  User,
  Lock,
  Mail,
  LogOut,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { SessionUser } from "../middleware/middleware";
import { Logo } from "../components/Logo";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const { slug } = useParams();

  if (!session || session.user.id !== slug) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Profil introuvable</p>
      </div>
    );
  }
  const user = session?.user as unknown as SessionUser;
  const isAdmin = user?.role === "admin";
  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    await authClient.updateUser({
      name,
      image,
    });
    setIsUpdating(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await authClient.changePassword({
      currentPassword: passwords.current,
      newPassword: passwords.new,
      revokeOtherSessions: true,
    });

    if (error) alert(error.message);
    else {
      setPasswords({ current: "", new: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6 flex gap-5 flex-col">
      <Link to="/" className="text-2xl font-bold text-gray-900"><Logo/></Link>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="h-20 w-20 bg-black rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
            {session?.user?.image || image ? (
              <img
                src={image || session?.user?.image || undefined}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {session?.user?.name}
            </h1>
            <p className="text-gray-500 flex items-center gap-1">
              <Mail size={14} /> {session?.user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black font-medium rounded-xl shadow-sm border border-gray-100">
              <User size={18} /> Général
            </button>
            {isAdmin ? (
              <Link
                to="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black font-medium rounded-xl shadow-sm border border-gray-100"
              >
                Dashboard
              </Link>
            ) : null}
            <button
              onClick={async () => {
                await authClient.signOut();
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </div>

          <div className="md:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="flex items-center gap-2 font-bold mb-4">
                <ShieldCheck size={20} className="text-blue-500" /> Informations
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Nom d'affichage
                  </p>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl p-3"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <ImageIcon size={12} /> URL de l'image
                  </p>
                  <input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://votre-image.com/photo.jpg"
                    className="w-full mt-1 bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl p-3"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  disabled={isUpdating}
                  className="bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition disabled:opacity-50"
                >
                  {isUpdating ? "Mise à jour..." : "Sauvegarder les infos"}
                </button>
              </div>
            </section>
            <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="flex items-center gap-2 font-bold mb-4">
                <Lock size={20} className="text-orange-500" /> Sécurité
              </h2>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <input
                  type="password"
                  placeholder="Mot de passe actuel"
                  className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl p-3 text-sm"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords({ ...passwords, current: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="w-full bg-gray-50 border-none focus:ring-2 focus:ring-black rounded-xl p-3 text-sm"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-zinc-100 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-zinc-200 transition"
                >
                  Modifier le mot de passe
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
