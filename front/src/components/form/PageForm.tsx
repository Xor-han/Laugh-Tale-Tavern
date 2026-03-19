import React, { useState, useEffect } from "react";

interface PageFormProps {
  entityId: number;
  entityType: string;
  initialTitle: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const PageForm = ({ entityId, entityType, initialTitle, onSubmit, onCancel }: PageFormProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");

  // Génération automatique du slug (URL friendly)
  useEffect(() => {
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
      .replace(/[^\w\s-]/g, "")       // Enlève les caractères spéciaux
      .replace(/[\s_-]+/g, "-")       // Remplace espaces par tirets
      .replace(/^-+|-+$/g, "");       // Nettoie les bords
    setSlug(generatedSlug);
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, slug, content, entityId, entityType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* SECTION TITRE */}
      <div>
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
          Titre de l'article
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-gray-800"
          placeholder="Ex: Monkey D. Luffy - Le Capitaine au Chapeau de Paille"
          required
        />
      </div>

      {/* APERÇU DE L'URL (SLUG) */}
      <div className="p-4 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-2xl">
        <label className="block text-[10px] font-black uppercase text-blue-400 mb-2">
          Aperçu de l'URL finale
        </label>
        <div className="flex items-center gap-1 font-mono text-sm overflow-x-auto whitespace-nowrap">
          <span className="text-gray-400">/wiki/</span>
          <span className="text-blue-600 font-bold">{entityType.toLowerCase()}s</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-bold bg-white px-2 py-0.5 rounded shadow-sm">
            {slug || "votre-slug"}
          </span>
        </div>
      </div>

      {/* SECTION CONTENU (TEXTAREA) */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Contenu de la page
          </label>
          <span className="text-[10px] text-gray-300 font-medium italic">
            Appuyez sur "Entrée" pour créer des paragraphes
          </span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all min-h-75 leading-relaxed text-gray-700"
          placeholder="Racontez l'histoire, les pouvoirs, les anecdotes..."
          required
        />
      </div>

      {/* BOUTONS D'ACTION */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 text-sm font-black uppercase text-gray-400 hover:text-gray-600 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-black uppercase shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Publier l'article
        </button>
      </div>
    </form>
  );
};