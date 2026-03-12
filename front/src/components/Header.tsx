import { Link } from "react-router-dom";
import headerBG from "../assets/header_background.svg";

export const Header = () => {
  return (
    <header
      className="flex justify-center items-center flex-col gap-8 bg-center bg-no-repeat bg-cover py-50 px-24"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${headerBG}')`,
      }}
    >
      <p className="text-4xl font-bold text-white">
        Bienvenue dans la taverne de Laugh Tale
      </p>
      <Link
        to={"/"}
        className="bg-black w-fit text-center text-white hover:bg-slate-700 px-5 py-4 rounded-lg"
      >
        Explorer l'univers
      </Link>
    </header>
  );
};
