/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";
import { Plus, Trash2, Apple, X, Upload } from "lucide-react";

// APIs
import {
  getFruits,
  getDevilFruitById,
  createFruit,
  deleteFruit,
  updateFruit,
} from "../api/devilFruits.api";

// Interfaces
import type {
  DevilFruit,
  CreateFruit,
} from "../interfaces/devilFruit.interface";
import { FruitForm } from "../components/form/FruitForm";
import { getTypes } from "../api/type.api";
import type { Type } from "../interfaces/type.interface";
import { EditFruitForm } from "./editForm/EditFruitForm";

export const DevilFruitDB = () => {
  const [selectedFruit, setSelectedFruit] = useState<DevilFruit>();
  const [fruits, setFruits] = useState<DevilFruit[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const fetchFruits = async () => {
    const data = await getFruits();
    setFruits(data);
    console.log(data);
  };

  useEffect(() => {
    const loadData = async () => {
      const typeData = await getTypes();
      setTypes(typeData);

      await fetchFruits();
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleCreateFruit = async (data: CreateFruit) => {
    await createFruit(data);
    setIsModalOpen(false);
    await fetchFruits();
  };

  const handleEditClick = async (id: number) => {
    try {
      const fullData = await getDevilFruitById(id);
      setSelectedFruit(fullData);
      setIsModalEditOpen(true);
    } catch (error) {
      console.error("Impossible de charger les détails du fruit", error);
    }
  };

  const handleUpdateFruit = async (id: number, data: CreateFruit) => {
    await updateFruit(id, data);
    setIsModalEditOpen(false);
    await fetchFruits();
  };

  const handleDeleteFruit = async (id: number) => {
    if (!confirm("Supprimer ce fruit du démon ?")) return;
    await deleteFruit(id);
    await fetchFruits();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic uppercase">
              Fruits du Démon
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
          {fruits.length === 0 ? (
            <div className="bg-white p-10 rounded-4xl text-center border border-dashed border-gray-300 text-gray-400 font-bold">
              Aucun fruit trouvé.
            </div>
          ) : (
            fruits.map((fruit) => (
              <div
                key={fruit.id}
                className="flex items-center justify-between bg-white p-4 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 overflow-hidden">
                    {fruit.image && fruit.image.length > 0 ? (
                      <img
                        src={fruit.image[0].url}
                        className="h-full w-full object-cover"
                        alt={fruit.name}
                      />
                    ) : (
                      <Apple className="text-purple-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black italic uppercase text-lg">
                      {fruit.name}
                    </h3>
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-md font-black uppercase">
                      {fruit.type?.name || "Inconnu"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                    <button
                    onClick={() => {
                      handleEditClick(fruit.id),
                      setSelectedFruit(fruit),
                      setIsModalEditOpen(true)
                    }}
                    className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <Upload size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteFruit(fruit.id)}
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
              <h2 className="text-2xl font-black italic">NOUVEAU FRUIT</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-150 overflow-y-auto custom-scrollbar">
              <FruitForm
                types={types}
                onSubmit={handleCreateFruit}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
       {isModalEditOpen && selectedFruit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black italic">
                      MODIFICATION DU FRUIT
                    </h2>
                    <button
                      onClick={() => setIsModalEditOpen(false)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="max-h-150 overflow-y-auto custom-scrollbar">
                    <EditFruitForm
                      devilFruit={selectedFruit}
                      onEditSubmit={handleUpdateFruit}
                      onCancel={() => setIsModalEditOpen(false)}
                      types={types}
                    />
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};
