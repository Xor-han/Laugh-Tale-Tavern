import { Link } from "react-router-dom";
import ArcsCard from "../assets/arcs_card.svg"
import CharacterCard from "../assets/character_card.svg"
import CrewCard from "../assets/crew_card.svg"
import OrganisationCard from "../assets/organisation_card.svg"
import FruitCard from "../assets/fruit_card.svg"
const categories = [
  { title: "Arcs", image: ArcsCard },
  { title: "Personnages", image: CharacterCard },
  { title: "Équipages Pirates", image: CrewCard },
  { title: "Organisations", image: OrganisationCard },
  { title: "Fruits du démon", image: FruitCard },
];

export const CategoryCard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-8">
      {categories.map((cat) => (
        <Link 
          key={cat.title} 
          to={`/${cat.title.toLowerCase().replace(/\s/g, '-')}`}
          className="group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div 
            className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${cat.image})` }}
          />
          
          <div className="bg-black p-4 text-white text-center font-bold tracking-wide">
            {cat.title}
          </div>
        </Link>
      ))}
    </div>
  );
};