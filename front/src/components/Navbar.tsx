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
    <nav className="flex px-24 py-7 gap-14 items-center justify-between">
      <h1 className="text-xl">Laugh Tale Tavern</h1>
      <ul className="flex gap-8 text-lg">
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
      <div className="flex max-w-1/2 w-full justify-self-end gap-10">
      <SearchBar />
      {
        session?
        <Link to={`/profile/${userId}`}>
          {userImage ? (
            <img src={userImage} alt="" className="w-8 rounded-full" />
          ) : (
            <User className="w-5 h-5" />
          )}
          <p>{userName}</p>
          </Link>
          :
          <Link to={"/login"} className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center hover:text-blue-600 ">
            <p>Se connecter</p>
          </Link>
      }
      </div>
    </nav>
  );
};
