import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";
import { uploadImage } from "../api/image.api";
import type { CreateCharacter } from "../interfaces/onePieceCharacter.interface";
import {
  Profession,
  type ProfessionType,
} from "../interfaces/profession.interface";
import type { DevilFruit } from "../interfaces/devilFruit.interface";
import { getFruits } from "../api/devilFruits.api";

interface Props {
  initialData?: CreateCharacter;
  onSubmit: (data: CreateCharacter) => void;
  onCancel: () => void;
}

export const CharacterForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [availableFruits, setAvailableFruits] = useState<DevilFruit[]>([]);

  const [formData, setFormData] = useState<CreateCharacter>(
    initialData || {
      name: "",
      imageUrl: "",
      imagePublicId: "",
      isAlive: true,
      profession: "empereur",
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanData = {
      ...formData,
      devilFruit_id: formData.devilFruit_id || null,
      organisationId: formData.organisationId || null,
      equipageId: formData.equipageId || null,
      arcId: formData.arcId || null,
    };
    console.log(formData);
    onSubmit(cleanData);
  };

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
  useEffect(() => {
    const loadFruits = async () => {
      const data = await getFruits();
      setAvailableFruits(data);
    };
    loadFruits();
  }, []);
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        placeholder="Nom du personnage"
        className="border p-2 rounded w-full"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Image du personnage</p>
        {formData.imageUrl ? (
          <div className="relative h-32 w-32 border rounded-lg overflow-hidden">
            <img
              src={formData.imageUrl}
              className="h-full w-full object-cover"
              alt="Preview"
            />
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, imageUrl: "", imagePublicId: "" })
              }
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed p-4 flex flex-col items-center cursor-pointer hover:border-black transition">
            <Upload size={20} />
            <span className="text-xs mt-1">
              {uploading ? "Envoi en cours..." : "Choisir une image"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        )}
      </div>
      <select
        className="border p-2 rounded w-full bg-white"
        value={formData.profession}
        onChange={(e) =>
          setFormData({
            ...formData,

            profession: e.target.value as ProfessionType,
          })
        }
      >
        <optgroup label="Équipage Pirate">
          <option value={Profession.roi_des_pirates}>Roi des pirates</option>

          <option value={Profession.empereur}>Empereur</option>

          <option value={Profession.capitaine}>Capitaine</option>

          <option value={Profession.second}>Second</option>

          <option value={Profession.navigateur}>Navigateur</option>

          <option value={Profession.cuisinier}>Cuisinier</option>

          <option value={Profession.medecin}>Médecin</option>

          <option value={Profession.tireur_d_elite}>Tireur d'élite</option>

          <option value={Profession.charpentier}>Charpentier</option>

          <option value={Profession.musicien}>Musicien</option>

          <option value={Profession.archeologue}>Archéologue</option>

          <option value={Profession.timonier}>Timonier</option>

          <option value={Profession.mousse}>Mousse</option>

          <option value={Profession.combattant}>Combattant</option>
        </optgroup>

        <optgroup label="Marine & Gouvernement">
          <option value={Profession.amiral_en_chef}>Amiral en chef</option>

          <option value={Profession.amiral}>Amiral</option>

          <option value={Profession.vice_amiral}>Vice-amiral</option>

          <option value={Profession.contre_amiral}>Contre-amiral</option>

          <option value={Profession.commodore}>Commodore</option>

          <option value={Profession.colonel}>Colonel</option>

          <option value={Profession.lieutenant}>Lieutenant</option>

          <option value={Profession.enseigne}>Enseigne</option>

          <option value={Profession.matelot}>Matelot</option>

          <option value={Profession.agent_du_cp}>Agent du CP</option>

          <option value={Profession.gardien_de_prison}>
            Gardien de prison
          </option>
        </optgroup>

        <optgroup label="Armée Révolutionnaire">
          <option value={Profession.chef_supreme}>Chef suprême</option>

          <option value={Profession.commandant_en_chef}>
            Commandant en chef
          </option>

          <option value={Profession.commandant_d_armee}>
            Commandant d'armée
          </option>

          <option value={Profession.officier_revolutionnaire}>
            Officier révolutionnaire
          </option>

          <option value={Profession.agent_d_infiltration}>
            Agent d'infiltration
          </option>

          <option value={Profession.stratege}>Stratège</option>

          <option value={Profession.inventeur}>Inventeur</option>
        </optgroup>

        <optgroup label="Civils & Métiers">
          <option value={Profession.tenancier_de_bar}>Tenancier de bar</option>

          <option value={Profession.journaliste}>Journaliste</option>

          <option value={Profession.scientifique}>Scientifique</option>

          <option value={Profession.forgeron}>Forgeron</option>

          <option value={Profession.chasseur_de_primes}>
            Chasseur de primes
          </option>

          <option value={Profession.marchand}>Marchand</option>

          <option value={Profession.roi}>Roi</option>

          <option value={Profession.reine}>Reine</option>

          <option value={Profession.prince}>Prince</option>

          <option value={Profession.princesse}>Princesse</option>

          <option value={Profession.citoyen}>Citoyen</option>

          <option value={Profession.pecheur}>Pêcheur</option>

          <option value={Profession.voleur}>Voleur</option>

          <option value={Profession.esclave}>Esclave</option>
        </optgroup>

        <optgroup label="Autres">
          <option value={Profession.courtier_de_l_ombre}>
            Courtier de l'ombre
          </option>

          <option value={Profession.dragon_celeste}>Dragon céleste</option>
        </optgroup>
      </select>
      <select
        value={formData.devilFruit_id || ""}
        onChange={(e) =>
          setFormData({
            ...formData,
            devilFruit_id: Number(e.target.value) || null,
          })
        }
        className="border p-2 rounded-xl w-full"
      >
        <option value="">Aucun Fruit</option>
        {availableFruits.map((fruit) => (
          <option key={fruit.id} value={fruit.id}>
            {fruit.name}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isAlive}
          onChange={(e) =>
            setFormData({ ...formData, isAlive: e.target.checked })
          }
        />
        <span>Le personnage est en vie</span>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="p-2 bg-gray-200 rounded"
        >
          Annuler
        </button>
        <button type="submit" className="p-2 bg-black text-white rounded">
          {initialData ? "Modifier" : "Créer"}
        </button>
      </div>
    </form>
  );
};
