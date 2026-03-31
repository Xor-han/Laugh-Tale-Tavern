import { Link } from "react-router-dom";
import { Menu, User, X } from "lucide-react";
import { Nav } from "./Nav";
import { useState } from "react";
import { ModalBurgerMenu } from "./MenuBurger";
interface Props {
  userName?: string;
  userId?: string;
  userImage: string | null | undefined;
  session: boolean;
}

export const Navbar = ({ userId, userImage, userName, session }: Props) => {
  const [openBurgerMenu, setOpenBurgerMenu] = useState(false);
  return (
    <nav className="flex px-10 py-7 items-center justify-between z-999 bg-[#1D293D] text-white fixed top-0 w-full">
      <div className="flex gap-14 items-center">
        <Link to="/">
          <h1 className="text-xl ">Laugh Tale Tavern</h1>
        </Link>
        <div className="max-lg:hidden">
          <ul className="flex gap-8 text-sm text-center items-center">
            <Nav />
          </ul>
        </div>
      </div>
      <div className="flex justify-self-end gap-10 ">
        {session ? (
          <Link
            to={`/profile/${userId}`}
            className="flex flex-col justify-center items-center"
          >
            {userImage ? (
              <img
                src={userImage}
                alt="Profile de l'utilisateur"
                className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
            <p>{userName}</p>
          </Link>
        ) : (
          <Link
            to={"/login"}
            className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center hover:text-blue-600 text-sm"
          >
            <p>Se connecter</p>
          </Link>
        )}
        <button
          onClick={() => setOpenBurgerMenu(!openBurgerMenu)}
          className="lg:hidden text-slate-50 z-50 relative"
        >
          {openBurgerMenu ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
        {openBurgerMenu && <ModalBurgerMenu />}
      </div>
    </nav>
  );
};
