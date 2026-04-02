import { useEffect, useState } from "react";
import type { BaseItem } from "../interfaces/item.interface";
import type { Article } from "../interfaces/article.interface";
import { getArticles } from "../api/article.api";
import { PageCard } from "./PageCard";

interface Props {
    items?: BaseItem[];
    entityType?: "characters" | "devilFruits" | "arcs" | "crews" | "organisations";
    title: string;
}

export const PagesContainer = ({ items, title, entityType }: Props) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(!items);

    useEffect(() => {
        if (items) return;
        getArticles()
            .then(setArticles)
            .catch((error) => console.error("Erreur chargement:", error))
            .finally(() => setLoading(false));
    }, [items]);

    const data = items || articles;

    if (loading) return <div>Chargement des articles...</div>;
    return (
        <div className="py-14 px-10 grid gap-10">
            <h2 className="text-6xl font-bold mb-8">{title}</h2>
            {data.length === 0 ? (
                <p className="text-gray-500 italic">Aucun élément trouvé dans cette catégorie.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 lg:grid-cols-4 gap-8">
                    {data.map((item) => (
                        <PageCard
                            key={`${entityType}-${item.id}`}
                            item={item}
                            type={entityType}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};