import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2, CheckCircle2, X, Skull, Laugh } from "lucide-react";
import { getImages, uploadImage, deleteImage } from "../../api/image.api";
import type { Image } from "../../interfaces/image.interface";
import type { DevilFruit } from "../../interfaces/devilFruit.interface";
import type { Organisation } from "../../interfaces/organisation.interface";
import type { Arc } from "../../interfaces/arc.interface";
import type { Crew } from "../../interfaces/equipage.interface";
import type { CreateCharacter } from "../../interfaces/onePieceCharacter.interface";
import { PROFESSION_OPTIONS } from "../../data/Profession";

interface Props {
  organisation: Organisation[];
  arcs: Arc[];
  crews: Crew[];
  devilFruit: DevilFruit[];
  onSubmit: (data: CreateCharacter) => void;
  onCancel: () => void;
}

export const CharacterForm = ({
  organisation,
  arcs,
  crews,
  devilFruit,
  onSubmit,
  onCancel,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ÉTATS ---
  const [name, setName] = useState("");
  const [content, setContent] = useState("")
  const [isAlive, setIsAlive] = useState(false);
  const [profession, setProfession] = useState("");
  const [organisationId, setOrganisationId] = useState<number | null>(null);
  const [crewId, setCrewId] = useState<number | null>(null);
  const [devilFruitId, setDevilFruitId] = useState<number | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);
  const [selectedArcIds, setSelectedArcIds] = useState<number[]>([]);

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
      await fetchImages();
    } catch {
      setError("Échec de l'upload");
    } finally {
      setUploading(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !profession ||
      !selectedImageId ||
      !selectedArcIds ||
      !organisationId ||
      !crewId ||
      !content.trim()
    ) {
      setError("Tous les champs sont obligatoires");
      return;
    }
    onSubmit({
      name: name.trim(),
      isAlive,
      profession: profession.trim(),
      imageId: selectedImageId,
      devilFruit_id: devilFruitId,
      arcIds: selectedArcIds,
      organisationId: organisationId,
      crewId: crewId,
      content: content
    });
  };

  const handleAddArc = (id: number) => {
    if (!id) return;

    if (!selectedArcIds.includes(id)) {
      setSelectedArcIds([...selectedArcIds, id]);
    }
  };

  const handleRemoveArc = (idToRemove: number) => {
    setSelectedArcIds(selectedArcIds.filter((id) => id !== idToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 h-100 ">
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-black uppercase text-gray-400">
            Nom du Personnage
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
            Profession du Personnage
          </label>
          <select
            value={profession ?? ""}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white outline-none"
            required
          >
            {[
              "Pirate",
              "Marine",
              "Gouvernement",
              "Révolutionnaire",
              "Royauté",
              "Civil",
              "Autre",
            ].map((cat) => (
              <optgroup key={cat} label={cat}>
                {PROFESSION_OPTIONS.filter((opt) => opt.category === cat).map(
                  (opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ),
                )}
              </optgroup>
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
        <label className="text-xs font-black uppercase text-gray-400">
          Fruit du personnage
        </label>
        <select
          value={devilFruitId ?? ""}
          onChange={(e) => setDevilFruitId(Number(e.target.value))}
          className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white outline-none"
        >
          <option value="">Sélectionner...</option>
          {devilFruit.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-black uppercase text-gray-400">
          Organisation du personnage
        </label>
        <select
          value={organisationId ?? ""}
          onChange={(e) => setOrganisationId(Number(e.target.value))}
          className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white outline-none"
        >
          <option value="">Sélectionner...</option>
          {organisation.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
        <div>
          <label className="text-xs font-black uppercase text-gray-400">
            Equipage du personnage
          </label>
          <select
            value={crewId ?? ""}
            onChange={(e) => setCrewId(Number(e.target.value))}
            className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white outline-none"
          >
            <option value="">Sélectionner...</option>
            {crews.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

      <div>
        <label className="text-xs font-black uppercase text-gray-400">
          Arcs d'apparition
        </label>
        <select
          value=""
          onChange={(e) => handleAddArc(Number(e.target.value))}
          className="w-full p-3 border-2 border-gray-100 rounded-xl bg-white outline-none focus:border-black"
        >
          <option value="">Ajouter un arc...</option>
          {arcs.map((arc) => (
            <option
              key={arc.id}
              value={arc.id}
              disabled={selectedArcIds.includes(arc.id)}
            >
              {arc.name}{" "}
              {selectedArcIds.includes(arc.id) ? "(Déjà ajouté)" : ""}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedArcIds.map((id) => {
            const arcName = arcs.find((a) => a.id === id)?.name;
            return (
              <span
                key={id}
                className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200"
              >
                {arcName}
                <button
                  type="button"
                  onClick={() => handleRemoveArc(id)}
                  className="hover:text-red-500 font-black"
                >
                  <X />
                </button>
              </span>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between p-3 border-2 border-gray-100 rounded-xl bg-gray-50/30">
        <div className="flex flex-col">
          <label className="text-xs font-black uppercase text-gray-400">
            Statut vital
          </label>
          <span className="text-sm font-bold text-gray-700">
            {isAlive ? 
            <div>
            <Laugh/>
            <p>En vie</p> 
            </div>
            :
            <div>
            <Skull/>
            <p>Décédé</p>
            </div> 
            }
          </span>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isAlive}
            onChange={(e) => setIsAlive(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
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
        <p className="text-sm font-bold text-red-500 uppercase">{error}</p>
      )}

      <div className="flex gap-3 p-2">
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
          Créer le personnage
        </button>
      </div>
    </form>
  );
};
