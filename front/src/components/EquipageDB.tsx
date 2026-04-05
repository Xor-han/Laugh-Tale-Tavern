/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useState } from "react";
import { Plus, Trash2, Apple, X, Upload } from "lucide-react";

// APIs
import { getCrews, createCrew, deleteCrew, getCrewById, updateCrew } from "../api/crew.api";
import { getOrganisations } from "../api/organisation.api";
// Interfaces
import type { Crew, CreateCrew } from "../interfaces/equipage.interface";
import { CrewForm} from "./form/CrewForm";
import type { Organisation } from "../interfaces/organisation.interface";
import { EditCrewForm } from "./editForm/EditCrewForm";

export const EquipageDB = () => {
  const [selectedCrew, setSelectedCrew] = useState<Crew>();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [organisation, setOrganisation] = useState<Organisation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const fetchCrews = async () => {
    const data = await getCrews();
    setCrews(data);
    console.log(data);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCrews();
      const organisationData = await getOrganisations();
      setOrganisation(organisationData);
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleCreateCrew = async (data: CreateCrew) => {
    await createCrew(data);
    setIsModalOpen(false);
    await fetchCrews();
  };

  const handleEditClick = async (id: number) => {
    try {
      const fullData = await getCrewById(id); // Appel à ton API
      setSelectedCrew(fullData);
      setIsModalEditOpen(true);
    } catch (error) {
      console.error("Impossible de charger les détails de l'équipage", error);
    }
  };

  const handleUpdatCrew = async (id: number, data: CreateCrew) => {
    await updateCrew(id, data);
    setIsModalEditOpen(false);
    await fetchCrews();
  };

  const handleDeleteCrew = async (id: number) => {
    if (!confirm("Supprimer cet Equipage ?")) return;
    await deleteCrew(id);
    await fetchCrews();
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
          {crews.length === 0 ? (
            <div className="bg-white p-10 rounded-4xl text-center border border-dashed border-gray-300 text-gray-400 font-bold">
              Aucun équipage trouvé.
            </div>
          ) : (
            crews.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-white p-4 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 overflow-hidden">
                    {c.image && c.image.length > 0 ? (
                      <img
                        src={c.image[0].url}
                        className="h-full w-full object-cover"
                        alt={c.name}
                      />
                    ) : (
                      <Apple className="text-purple-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black italic uppercase text-lg">
                      {c.name}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-2">
                <button
                    onClick={() => {
                      handleEditClick(c.id),
                      setSelectedCrew(c),
                      setIsModalEditOpen(true)
                    }}
                    className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-blue-500 hover:text-white transition-all"
                  >
                    <Upload size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteCrew(c.id)}
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
            <div className="max-h-150 overflow-y-auto custom-scrollbar">
              <CrewForm
                onSubmit={handleCreateCrew}
                onCancel={() => setIsModalOpen(false)}
                organisations={organisation}
              />
            </div>
          </div>
        </div>
      )}

         {isModalEditOpen && selectedCrew && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black italic">
                      MODIFICATION DE L'EQUIPAGE
                    </h2>
                    <button
                      onClick={() => setIsModalEditOpen(false)}
                      className="p-2 bg-gray-100 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="max-h-150 overflow-y-auto custom-scrollbar">
                    <EditCrewForm
                      crew={selectedCrew}
                      onEditSubmit={handleUpdatCrew}
                      onCancel={() => setIsModalEditOpen(false)}
                      organisations={organisation}
                    />
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};
