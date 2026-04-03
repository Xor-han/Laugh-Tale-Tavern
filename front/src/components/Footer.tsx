import { Nav } from "./Nav";

export const Footer = () => {
  return (
    <footer className="bg-[#1D293D] text-white flex flex-col items-center py-10 gap-4 max-md:flex-row max-md:justify-center max-md:gap-9">
      <p className="max-md:w-1/2">Laugh Tale Tavern — Une encyclopédie One Piece créée par des fans</p>
      <nav>
        <ul className="flex gap-8 text-sm text-center items-center max-md:gap-3 max-md:flex-col max-md:text-left">
          <Nav />
        </ul>
      </nav>
    </footer>
  );
};
