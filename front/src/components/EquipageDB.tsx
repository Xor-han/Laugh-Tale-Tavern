import { useEffect, useState } from "react";
import { Plus, Trash2, Apple, X, Upload } from "lucide-react";

// APIs
import {
  getEquipages,
  createEquipage,
  deleteEquipage,
} from "../api/equipage.api";
import { getOrganisations } from "../api/organisation.api";
// Interfaces
import type {
  Equipage,
  CreateEquipage,
} from "../interfaces/equipage.interface";
import { EquipageForm } from "./form/EquipageForm";
import type { Organisation } from "../interfaces/organisation.interface";

export const ArcDB = () => {
  const [equipages, setEquipages] = useState<Equipage[]>([]);
  const [organisation, setOrganisation] = useState<Organisation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEquipages = async () => {
    const data = await getEquipages();
    setEquipages(data);
    console.log(data);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchEquipages();
      const organisationData = await getOrganisations();
      setOrganisation(organisationData);
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleCreateEquipage = async (data: CreateEquipage) => {
    await createEquipage(data);
    setIsModalOpen(false);
    await fetchEquipages();
  };

  const handleDeleteEquipage = async (id: number) => {
    if (!confirm("Supprimer cet Equipage ?")) return;
    await deleteEquipage(id);
    await fetchEquipages();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic uppercase">
              Les Equipages
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
          {equipages.length === 0 ? (
            <div className="bg-white p-10 rounded-4xl text-center border border-dashed border-gray-300 text-gray-400 font-bold">
              Aucun équipage trouvé.
            </div>
          ) : (
            equipages.map((eq) => (
              <div
                key={eq.id}
                className="flex items-center justify-between bg-white p-4 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 overflow-hidden">
                    {eq.image && eq.image.length > 0 ? (
                      <img
                        src={eq.image[0].url}
                        className="h-full w-full object-cover"
                        alt={eq.name}
                      />
                    ) : (
                      <Apple className="text-purple-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black italic uppercase text-lg">
                      {eq.name}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <Upload size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteEquipage(eq.id)}
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
              <h2 className="text-2xl font-black italic">NOUVEAU EQUIPAGE</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <EquipageForm
              onSubmit={handleCreateEquipage}
              onCancel={() => setIsModalOpen(false)}
              organisations={organisation}
            />
          </div>
        </div>
      )}
    </div>
  );
};
