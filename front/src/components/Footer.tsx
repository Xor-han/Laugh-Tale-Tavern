import { Nav } from "./Nav"

export const Footer = () => {
    return (
        <footer className="bg-[#1D293D] text-white flex flex-col items-center py-10 gap-4">
            <p>Laugh Tale Tavern — Une encyclopédie One Piece créée par des fans</p>
            <nav>
                <Nav/>
            </nav>
        </footer>
    )
}