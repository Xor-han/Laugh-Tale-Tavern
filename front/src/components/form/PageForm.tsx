import { useState, useEffect } from "react";

interface Props {
  entityType: "CHARACTER" | "ARC" | "FRUIT" | "ORGANISATION";
  entityId: number;
  initialTitle?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const PageForm = ({
  entityType,
  entityId,
  initialTitle,
  onSubmit,
  onCancel,
}: Props) => {
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");

  // Génération automatique du slug quand le titre change
useEffect(() => {
  const generatedSlug = title
    .toLowerCase()
    .trim()
    .normalize("NFD") // Supprime les accents (ex: é -> e)
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "") // Supprime les caractères spéciaux
    .replace(/[\s_-]+/g, "-") // Remplace espaces et underscores par un seul tiret
    .replace(/^-+|-+$/g, ""); // Nettoie les tirets au début et à la fin
  setSlug(generatedSlug);
}, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug,
      content,
      entityType,
      entityId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {/* TITRE DE LA PAGE */}
        <div>
          <label className="text-xs font-black uppercase text-gray-400">
            Titre de la page
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-all"
            placeholder="Ex: Monkey D. Luffy - Le futur Roi des Pirates"
            required
          />
        </div>

        {/* APERÇU DE L'URL DYNAMIQUE */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
              Aperçu de l'adresse (SEO)
            </label>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
              Optimisé
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="text-gray-400">laugh-tale-tavern/</span>
            <span className="text-gray-400">{entityType.toLowerCase()}s/</span>
            <div className="px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-1 group">
              <span className="text-blue-600 font-bold">
                {slug || "votre-titre-ici"}
              </span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic">
            * Le slug est généré automatiquement à partir du titre pour un
            meilleur référencement.
          </p>
        </div>
        {/* CONTENU (TEXTAREA) */}
        <div>
          <label className="text-xs font-black uppercase text-gray-400">
            Contenu (Plusieurs paragraphes possibles)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-all min-h-62.5 leading-relaxed"
            placeholder="Rédigez l'histoire, les détails techniques..."
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-3 text-sm font-black uppercase text-gray-400"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 p-3 bg-blue-600 text-white rounded-xl text-sm font-black uppercase shadow-lg shadow-blue-200 hover:scale-105 transition-all"
        >
          Publier la page
        </button>
      </div>
    </form>
  );
};
