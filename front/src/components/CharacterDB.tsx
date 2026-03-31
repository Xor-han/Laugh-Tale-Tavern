import { useEffect, useState } from "react";
import { Plus, Trash2, Apple, X} from "lucide-react";

// APIs
import {
  getCharacters,
  deleteCharacter,
  createCharacter,
} from "../api/onePieceCharacter.api";
import type {
  CreateCharacter,
  OnePieceCharacter,
} from "../interfaces/onePieceCharacter.interface";
import { CharacterForm } from "./form/CharacterForm";
import { getFruits } from "../api/devilFruits.api";
import { getOrganisations } from "../api/organisation.api";
import { getEquipages } from "../api/equipage.api";
import { getArcs } from "../api/arc.api";
import type { DevilFruit } from "../interfaces/devilFruit.interface";
import type { Organisation } from "../interfaces/organisation.interface";
import type { Arc } from "../interfaces/arc.interface";
import type { Crew } from "../interfaces/equipage.interface";

export const CharacterDB = () => {
  const [characters, setCharacters] = useState<OnePieceCharacter[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fruits, setFruits] = useState<DevilFruit[]>([]);
  const [organisation, setOrganisation] = useState<Organisation[]>([]);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [equipage, setEquipage] = useState<Crew[]>([]);

  const fetchCharacters = async () => {
    const data = await getCharacters();
    setCharacters(data);
    console.log(data);
  };
  useEffect(() => {
    const loadData = async () => {
      const fruitData = await getFruits();
      setFruits(fruitData);
      const organisationData = await getOrganisations();
      setOrganisation(organisationData);
      const arcData = await getArcs();
      setArcs(arcData);
      const equipageData = await getEquipages();
      setEquipage(equipageData);

      await fetchCharacters();
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleCreateCharacter = async (data: CreateCharacter) => {
    await createCharacter(data);
    setIsModalOpen(false);
    await fetchCharacters();
  };

  const handleDeleteCharacter = async (id: number) => {
    if (!confirm("Supprimer ce personnage ?")) return;
    await deleteCharacter(id);
    await fetchCharacters();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic uppercase">
              Personnages
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-black hover:scale-105 transition-transform shadow-lg"
          >
            <Plus size={20} /> AJOUTER
          </button>
        </div>
        <div className="grid gap-4">
          {characters.length === 0 ? (
            <div className="bg-white p-10 rounded-4xl text-center border border-dashed border-gray-300 text-gray-400 font-bold">
              Aucun Personnages trouvé.
            </div>
          ) : (
            characters.map((character) => (
              <div
                key={character.id}
                className="flex items-center justify-between bg-white p-4 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 overflow-hidden">
                    {character.image && character.image.length > 0 ? (
                      <img
                        src={character.image[0].url}
                        className="h-full w-full object-cover"
                        alt={character.name}
                      />
                    ) : (
                      <Apple className="text-purple-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black italic uppercase text-lg">
                      {character.name}
                    </h3>
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-md font-black uppercase">
                      {character.profession || "Inconnu"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteCharacter(character.id)}
                    className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black italic">NOUVEAU PERSONNAGE</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-150 overflow-y-auto custom-scrollbar">
              <CharacterForm
                onSubmit={handleCreateCharacter}
                onCancel={() => setIsModalOpen(false)}
                organisation={organisation}
                arcs={arcs}
                crews={equipage}
                devilFruit={fruits}
              />
            </div>
          </div>
        </div>
      )}
    
    </div>
  );
};
