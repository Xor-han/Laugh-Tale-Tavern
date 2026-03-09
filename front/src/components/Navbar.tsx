import { Link } from "react-router-dom";
import { SearchBar } from "./ui/SearchBar";
import { User } from "lucide-react";
interface Props {
  userName?: string;
  userId?: string;
  userImage: string | null | undefined;
  session: boolean
}

export const Navbar = ({ userId, userImage, userName, session }: Props) => {
  return (
    <nav className="flex px-24 py-7 items-center justify-between">
      <div className="flex gap-14">
      <h1 className="text-xl">Laugh Tale Tavern</h1>
      <ul className="flex gap-8 text-sm text-center items-center">
        <li className="hover:text-yellow-400">
          <Link to={"/"}>Arcs</Link>
        </li>
        <li className="hover:text-red-400">
          <Link to={"/"}>Personnages</Link>
        </li>
        <li className="hover:text-blue-400">
          <Link to={"/"}>Equipages Pirates</Link>
        </li>
        <li className="hover:text-slate-400">
          <Link to={"/"}>Organisations</Link>
        </li>
        <li className="hover:text-purple-400">
          <Link to={"/"}>Fruits du démon</Link>
        </li>
      </ul>
      </div>
      <div className="flex justify-self-end gap-10 ">
      <SearchBar />
      {
        session?
        <Link to={`/profile/${userId}`} className="flex flex-col justify-center items-center">
          {userImage ? (
            <img src={userImage} alt="Profile de l'utilisateur" className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <p>{userName}</p>
          </Link>
          :
          <Link to={"/login"} className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center hover:text-blue-600 text-sm">
            <p>Se connecter</p>
          </Link>
      }
      </div>
    </nav>
  );
};
