import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, X, Apple, Users, Filter } from "lucide-react";

import {
  getCharacters,
  deleteCharacter,
  createCharacter,
  updateCharacter,
} from "../api/onePieceCharacter.api";
import {
  getFruits,
  deleteFruit,
  createFruit,
  updateFruit,
} from "../api/devilFruits.api";
import { getTypes } from "../api/type.api"; //

import type {
  CharacterFormData,
  OnePieceCharacter,
} from "../interfaces/onePieceCharacter.interface";
import type {
  DevilFruit,
  FruitFormData,
} from "../interfaces/devilFruit.interface";
import type { Type } from "../interfaces/type.interface"; //

import { CharacterForm } from "../components/CharacterForm";
import { FruitForm } from "../components/FruitForm";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"characters" | "fruits">(
    "characters",
  );
  const [characters, setCharacters] = useState<OnePieceCharacter[]>([]);
  const [fruits, setFruits] = useState<DevilFruit[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "all">("all");

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<
    OnePieceCharacter | DevilFruit | null
  >(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [charData, fruitData, typeData] = await Promise.all([
        getCharacters(),
        getFruits(),
        getTypes(),
      ]);
      setCharacters(charData);
      setFruits(fruitData);
      setTypes(typeData);
    } catch (e) {
      console.error("Erreur de chargement:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredFruits =
    selectedTypeId === "all"
      ? fruits
      : fruits.filter((f) => f.typeId === selectedTypeId);

  // --- HANDLERS (SANS TERNAIRES) ---
  const handleCharacterSubmit = async (data: CharacterFormData) => {
    try {
      if (editingItem && "isAlive" in editingItem) {
        await updateCharacter(editingItem.id, data);
      } else {
        await createCharacter(data);
      }
      closeModal();
      await loadData();
    } catch (error) {
      alert(`Erreur lors de l'enregistrement du personnage, ${error}`);
    }
  };

  const handleFruitSubmit = async (data: FruitFormData) => {
    try {
      if (editingItem && !("isAlive" in editingItem)) {
        await updateFruit(editingItem.id, data);
      } else {
        await createFruit(data);
      }
      closeModal();
      await loadData();
    } catch (error) {
      alert(`Erreur lors de l'enregistrement du fruit, ${error}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cet élément ?")) return;

    try {
      if (activeTab === "characters") {
        await deleteCharacter(id);
      } else {
        await deleteFruit(id);
      }
      await loadData();
    } catch (error) {
      alert(`Erreur lors de la suppression du personnage, ${error}`);
    }
  };

  const closeModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black text-gray-400 animate-pulse">
        CHARGEMENT...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-black italic">
              DASHBOARD
            </h1>
            <p className="text-gray-400 font-bold uppercase text-xs tracking-[0.3em]">
              Gestion du contenu
            </p>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-4xl">
            <button
              onClick={() => setActiveTab("characters")}
              className={`flex items-center gap-2 px-8 py-3 rounded-[1.8rem] font-black transition-all ${activeTab === "characters" ? "bg-white text-black shadow-xl scale-105" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Users size={20} /> PERSONNAGES
            </button>
            <button
              onClick={() => setActiveTab("fruits")}
              className={`flex items-center gap-2 px-8 py-3 rounded-[1.8rem] font-black transition-all ${activeTab === "fruits" ? "bg-white text-black shadow-xl scale-105" : "text-gray-400 hover:text-gray-600"}`}
            >
              <Apple size={20} /> FRUITS
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <button
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-4xl font-black hover:bg-zinc-800 transition-all shadow-2xl w-full md:w-fit"
          >
            <Plus size={24} strokeWidth={3} /> AJOUTER{" "}
            {activeTab === "characters" ? "UN PERSONNAGE" : "UN FRUIT"}
          </button>

          {activeTab === "fruits" && (
            <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-4xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 text-gray-400 mr-2">
                <Filter size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Filtrer par type :
                </span>
              </div>
              <button
                onClick={() => setSelectedTypeId("all")}
                className={`px-5 py-2 rounded-full text-xs font-black transition-all ${selectedTypeId === "all" ? "bg-purple-600 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
              >
                TOUS
              </button>
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTypeId(t.id)}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase transition-all ${selectedTypeId === t.id ? "bg-purple-600 text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {activeTab === "characters"
            ? characters.map((char) => (
                <div
                  key={char.id}
                  className="group flex items-center justify-between bg-white p-5 rounded-[2.5rem] border border-gray-100 hover:border-black transition-all shadow-sm"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-3xl overflow-hidden border-2 border-gray-50 bg-gray-50">
                      <img
                        src={char.image?.url}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={char.name}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-black italic uppercase text-gray-900">
                        {char.name}
                      </h3>
                      <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
                        {char.profession}
                      </p>
                      {char.devilFruit_id && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 uppercase">
                          <Apple size={12} />
                          {fruits.find((f) => f.id === char.devilFruit_id)
                            ?.name || "Fruit inconnu"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(char);
                        setIsModalOpen(true);
                      }}
                      className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-black hover:text-white transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(char.id)}
                      className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            : filteredFruits.map((fruit) => (
                <div
                  key={fruit.id}
                  className="group flex items-center justify-between bg-white p-5 rounded-[2.5rem] border border-gray-100 hover:border-purple-500 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-3xl bg-purple-50 flex items-center justify-center border-2 border-purple-100">
                      {fruit.image?.url ? (
                        <img
                          src={fruit.image.url}
                          className="h-full w-full object-cover rounded-3xl"
                          alt={fruit.name}
                        />
                      ) : (
                        <Apple size={32} className="text-purple-300" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-black italic uppercase text-gray-900">
                        {fruit.name}
                      </h3>
                      <span className="w-fit px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest mt-1">
                        {fruit.type?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(fruit);
                        setIsModalOpen(true);
                      }}
                      className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-purple-600 hover:text-white transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(fruit.id)}
                      className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="flex justify-between items-center p-10 border-b border-gray-50">
              <h2 className="text-3xl font-black italic">
                {editingItem ? "MODIFIER" : "AJOUTER"}
              </h2>
              <button
                onClick={closeModal}
                className="p-3 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-10 max-h-[75vh] overflow-y-auto">
              {activeTab === "characters" ? (
                <CharacterForm
                  initialData={editingItem as OnePieceCharacter}
                  onSubmit={handleCharacterSubmit}
                  onCancel={closeModal}
                />
              ) : (
                <FruitForm
                  initialData={editingItem as DevilFruit}
                  onSubmit={handleFruitSubmit}
                  onCancel={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
