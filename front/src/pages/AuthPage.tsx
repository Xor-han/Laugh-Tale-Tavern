import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


interface Props {
    onAuth: () => void;
}

export const AuthPage = ({ onAuth }: Props) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (isSignUp) {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
            });
            if (error) {
                setError(error.message || "Erreur lors de l'inscription");
                setLoading(false);
                return;
            }
        } else {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });
            if (error) {
                setError(error.message || "Erreur lors de la connexion");
                setLoading(false);
                return;
            }
        }

        setLoading(false);
        onAuth();
        navigate("/");
    };

    return (
        <div className="h-screen flex items-center justify-center bg-zinc-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl p-10 w-full max-w-sm flex flex-col gap-5 shadow-lg"
            >
                <Link to={"/"} className="cursor-pointer text-red-600 hover:text-black w-fit flex self-end"><X className="w-5 h-5"/></Link>
                <h1 className="text-2xl font-bold text-center">Laugh Tale Tavern</h1>
                <p className="text-sm text-center text-gray-500">
                    {isSignUp ? "Créer un compte" : "Se connecter"}
                </p>

                {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {isSignUp && (
                    <input
                        type="text"
                        placeholder="Nom"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-500"
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-500"
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-gray-500"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white rounded-lg px-4 py-2 cursor-pointer disabled:opacity-50"
                >
                    {loading ? "..." : isSignUp ? "S'inscrire" : "Se connecter"}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError("");
                    }}
                    className="text-sm text-gray-500 hover:text-black cursor-pointer"
                >
                    {isSignUp
                        ? "Déjà un compte ? Se connecter"
                        : "Pas de compte ? S'inscrire"}
                </button>
            </form>
        </div>
    );
};