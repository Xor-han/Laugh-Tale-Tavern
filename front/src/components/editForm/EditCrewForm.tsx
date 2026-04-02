import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2, CheckCircle2, X } from "lucide-react";
import { getImages, uploadImage, deleteImage } from "../../api/image.api";
import type { Image } from "../../interfaces/image.interface";
import type { Crew, CreateCrew } from "../../interfaces/equipage.interface";
import type { Organisation } from "../../interfaces/organisation.interface";

interface Props {
  crew: Crew;
  organisations: Organisation[];
  onEditSubmit: (id: number, data: CreateCrew) => void;
  onCancel: () => void;
}

export const EditCrewForm = ({
  crew,
  organisations,
  onEditSubmit,
  onCancel,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ÉTATS ---
  const [name, setName] = useState("");
  const [selectedOrgIds, setSelectedOrgIds] = useState<number[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [content, setContent] = useState("");

  // États Techniques
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (crew) {
      setName(crew.name || "");
      setContent(crew.content || "");
      if (crew.organisation) {
        setSelectedOrgIds(crew.organisation.map((org: any) => org.id));
      }
    }
  }, [crew]);

  // --- CHARGEMENT ---
  const fetchImages = async () => {
    try {
      const data = await getImages();
      setImages(data);
    } catch {
      setError("Erreur de chargement des images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // --- ACTIONS ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadImage(file);
      await fetchImages();
    } catch {
      setError("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleAddOrganisations = (id: number) => {
    if (id && !selectedOrgIds.includes(id)) {
      setSelectedOrgIds([...selectedOrgIds, id]);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Supprimer cette image définitivement ?")) return;

    setDeletingId(id);
    try {
      await deleteImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      if (selectedImageId === id) setSelectedImageId(null);
    } catch {
      setError("Erreur de suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedImageId || !content.trim()) {
      setError("Le nom, l'image et le contenu sont obligatoires");
      return;
    }
    onEditSubmit(crew.id, {
      name: name.trim(),
      imageId: selectedImageId,
      content: content.trim(),
    });
  };

  return (
    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 h-100 ">
      {/* NOM & ORGANISATION */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-black uppercase text-gray-400">
            Nom de l'Équipage
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Mugiwara, Beast Pirates..."
            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-all"
            required
          />
        </div>

        {/* Organisations (Multi-Select) */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-black uppercase text-gray-400">
            L'organisation ou les organisations de l'équipage
          </label>
          <select
            value=""
            onChange={(e) => handleAddOrganisations(Number(e.target.value))}
            className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white outline-none focus:border-black transition-all"
          >
            <option value="">
              Sélectionner une ou plusieurs organisations...
            </option>
            {organisations
              .filter((o) => !selectedOrgIds.includes(o.id))
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
          </select>

          <div className="flex flex-wrap gap-2">
            {selectedOrgIds.map((id) => (
              <span
                key={id}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200"
              >
                {organisations.find((o) => o.id === id)?.name}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedOrgIds(
                      selectedOrgIds.filter((oId) => oId !== id),
                    )
                  }
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* GALERIE D'IMAGES */}
           <div className="flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <label className="text-xs font-black uppercase text-gray-400">
            Choisir une image
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold flex items-center gap-1 text-blue-600 hover:underline"
          >
            {uploading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
            Nouveau
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept="image/*"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border-2 border-gray-50 rounded-2xl bg-gray-50/50">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-gray-300" />
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImageId(img.id)}
                  className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedImageId === img.id
                      ? "border-black ring-2 ring-black/10"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    className="w-full h-full object-cover"
                    alt=""
                  />

                  {selectedImageId === img.id && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <CheckCircle2
                        className="text-black bg-white rounded-full"
                        size={20}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, img.id)}
                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-md opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shadow-sm"
                  >
                    {deletingId === img.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
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
      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase">{error}</p>
      )}

      {/* BOUTONS ACTIONS */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-3 text-sm font-black uppercase text-gray-400 hover:text-black transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="flex-1 p-3 bg-black text-white rounded-xl text-sm font-black uppercase shadow-lg shadow-black/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          Créer l'équipage
        </button>
      </div>
    </form>
  );
};
