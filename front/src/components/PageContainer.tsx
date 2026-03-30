import type { BaseItem } from "../interfaces/item.interface";
import { PageCard } from "./PageCard";

interface Props {
    items: BaseItem[];
  type: "characters" | "fruits" | "arcs" | "crews" | "organisations";
    title : string 
}

export const PagesContainer = ({ items, title, type }: Props) => {
    return (
        <div className="py-14 px-10 grid gap-10">
            <h2 className="text-6xl font-bold mb-8">{title}</h2>
            
   
            {items.length === 0 ? (
                <p className="text-gray-500 italic">Aucun élément trouvé dans cette catégorie.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {items.map((item) => (
                        <PageCard 
                            key={item.id} 
                            item={item} 
                            type={type} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};