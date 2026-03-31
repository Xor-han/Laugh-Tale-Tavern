import { Nav } from "./Nav";

export const Footer = () => {
  return (
    <footer className="bg-[#1D293D] text-white flex flex-col items-center py-10 gap-4">
      <p>Laugh Tale Tavern — Une encyclopédie One Piece créée par des fans</p>
      <nav>
        <ul className="flex gap-8 text-sm text-center items-center">
          <Nav />
        </ul>
      </nav>
    </footer>
  );
};
