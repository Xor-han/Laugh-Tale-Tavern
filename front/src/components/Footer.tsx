import { Nav } from "./Nav";
import LogoFooter from "../assets/LOGO_2_LTT.png"
export const Footer = () => {
  return (
    <footer className="bg-[#1D293D] px-10 text-white flex flex-col items-center py-10 gap-4 max-md:flex-row max-md:justify-center max-md:gap-9">
      <div className="flex flex-col items-center max-md: w-1/2">
      <img src={LogoFooter} alt="Logo du site" className="w-50"/>
      <p className="max-lg:text-center">Laugh Tale Tavern — Une encyclopédie One Piece créée par des fans</p>
      </div>
      <nav className="max-md:w-1/2 max-sm:hidden">
        <ul className="flex gap-8 text-sm text-center items-center max-md:gap-3 max-md:flex-col max-md:text-left">
          <Nav />
        </ul>
      </nav>
    </footer>
  );
};
