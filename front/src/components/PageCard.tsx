import { Link } from "react-router-dom";
import type { BaseItem } from "../interfaces/item.interface";

interface PageCardProps {
  item: BaseItem; 
  type: "characters" | "fruits" | "arcs" | "crews" | "organisations"; 
}

export const PageCard = ({ item, type }: PageCardProps) => {
  const imageUrl = item.image?.[0]?.url || "/placeholder-one-piece.png";

  return (
    <Link
      to={`/${type}/${item.slug}`}
      className="group block h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* SECTION IMAGE */}
      <div className="h-48 overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* SECTION CONTENU */}
      <div className="p-5">

        <span className="inline-block bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
          {type.replace('s', '')}
        </span>

        <h2 className="text-xl font-extrabold text-gray-950 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
          {item.name}
        </h2>
        
        <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
          {item.content}
        </p>
      </div>
    </Link>
  );
};