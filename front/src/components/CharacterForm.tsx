import { useState } from "react";
import type { CreateCharacter } from "../interfaces/onePieceCharacter.interface"; // Ton interface
import {
  Profession,
  type ProfessionType,
} from "../interfaces/profession.interface";
interface Props {
  initialData?: CreateCharacter;
  onSubmit: (data: CreateCharacter) => Promise<void>;
  onCancel: () => void;
}

export const CharacterForm = ({ initialData, onSubmit, onCancel }: Props) => {
  const [formData, setFormData] = useState<CreateCharacter>(
    initialData || {
      name: "",
      image: "",
      isAlive: true,
      profession: "empereur",
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        placeholder="Nom du personnage"
        className="border p-2 rounded w-full"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        placeholder="URL de l'image"
        className="border p-2 rounded w-full"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
      />
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

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.isAlive}
          onChange={(e) =>
            setFormData({ ...formData, isAlive: e.target.checked })
          }
        />
        <span>Le personnage est en vie</span>
      </label>

      <div className="flex gap-2">
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
