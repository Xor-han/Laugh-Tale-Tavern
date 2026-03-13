import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { getImages, uploadImage, deleteImage } from "../../api/image.api";
import type { Type } from "../../interfaces/type.interface";
import type { Image } from "../../interfaces/image.interface";
import type { CreateFruit } from "../../interfaces/devilFruit.interface";

interface Props {
  types: Type[];
  onSubmit: (data: CreateFruit) => void;
  onCancel: () => void;
}

export const FruitForm = ({ types, onSubmit, onCancel }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ÉTATS ---
  const [name, setName] = useState("");
  const [type_id, setTypeId] = useState<number | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  // États Techniques
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

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
      await fetchImages(); // On rafraîchit la liste
    } catch {
      setError("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Pour éviter de sélectionner l'image en la supprimant
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !type_id || !selectedImageId) {
      setError("Tous les champs sont obligatoires");
      return;
    }
    onSubmit({ name: name.trim(), typeId: type_id, imageId: selectedImageId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* NOM & TYPE (Même chose que d'habitude) */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-black uppercase text-gray-400">
            Nom du Fruit
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-black outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="text-xs font-black uppercase text-gray-400">
            Type de Fruit
          </label>
          <select
            value={type_id ?? ""}
            onChange={(e) => setTypeId(Number(e.target.value))}
            className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white outline-none"
            required
          >
            <option value="">Sélectionner...</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GALERIE DANS LE FORMULAIRE */}
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

        {/* GRILLE D'IMAGES (Inspiré de ton exemple) */}
        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border-2 border-gray-50 rounded-2xl bg-gray-50/50">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-gray-300" />
            </div>
          ) : (
            <div className="grid grid-cols-3 ...">
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

                  {/* Overlay de sélection */}
                  {selectedImageId === img.id && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <CheckCircle2
                        className="text-black bg-white rounded-full"
                        size={20}
                      />
                    </div>
                  )}

                  {/* Bouton supprimer (uniquement au survol) */}
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

      {error && (
        <p className="text-[10px] font-bold text-red-500 uppercase">{error}</p>
      )}

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
          Créer le fruit
        </button>
      </div>
    </form>
  );
};
