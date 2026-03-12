import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { uploadImage } from "../api/image.api";
import type {
  DevilFruit,
  FruitFormData,
} from "../interfaces/devilFruit.interface";
import type { Type } from "../interfaces/type.interface";
import { getTypes } from "../api/type.api";

interface Props {
  initialData?: DevilFruit | null;
  onSubmit: (data: FruitFormData) => Promise<void>;
  onCancel: () => void;
}

export const FruitForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const [types, setTypes] = useState<Type[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    typeId: 1,
    imageUrl: "",
    imagePublicId: "",
  });

  useEffect(() => {
    const loadTypes = async () => {
      const data = await getTypes();
      setTypes(data);
      if (!initialData && data.length > 0) {
        setFormData((prev) => ({ ...prev, typeId: data[0].id }));
      }
    };
    loadTypes();
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        typeId: initialData.typeId || 1,
        imageUrl: initialData.image?.url || "",
        imagePublicId: initialData.image?.publicId || "",
      });
    }
  }, [initialData]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        imageUrl: res.url,
        imagePublicId: res.publicId,
      }));
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="flex flex-col gap-4"
    >
      <input
        placeholder="Nom du fruit"
        className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-black outline-none"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <select
        className="border p-3 rounded-xl w-full bg-white outline-none"
        value={formData.typeId}
        onChange={(e) =>
          setFormData({ ...formData, typeId: Number(e.target.value) })
        }
      >
        {types.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-gray-700">Image du fruit</p>
        {formData.imageUrl ? (
          <div className="relative h-40 w-full border rounded-2xl overflow-hidden bg-gray-50">
            <img
              src={formData.imageUrl}
              className="h-full w-full object-contain"
              alt="Preview"
            />
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, imageUrl: "", imagePublicId: "" })
              }
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-200 p-8 flex flex-col items-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all rounded-2xl">
            <Upload size={24} className="text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-500">
              {uploading ? "Chargement..." : "Cliquer pour uploader"}
            </span>
            <input
              id="fruitImage"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-black text-white font-semibold rounded-xl hover:bg-zinc-800 transition"
        >
          {initialData ? "Sauvegarder les modifs" : "Créer le fruit"}
        </button>
      </div>
    </form>
  );
};
