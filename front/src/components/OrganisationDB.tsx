import { useEffect, useState } from "react";
import { Plus, Trash2, Apple, X} from "lucide-react";

// APIs
import {
  getOrganisations,
  createOrganisation,
  deleteOrganisation,
} from "../api/organisation.api";
import { getEquipages } from "../api/equipage.api";

// Interfaces
import type {
  Organisation,
  CreateOrg,
} from "../interfaces/organisation.interface";
import { OrganisationForm } from "./form/OrganisationForm";
import type { Equipage } from "../interfaces/equipage.interface";
import { PageForm } from "./form/PageForm";
import { createPage } from "../api/page.api";

export const OrganisationDB = () => {
  const [organisation, setOrganisation] = useState<Organisation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [equipage, setEquipage] = useState<Equipage[]>([]);
  const [isModalPageOpen, setIsModalPageOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const fetchOrganisation = async () => {
    const data = await getOrganisations();
    setOrganisation(data);
    console.log(data);
  };

  useEffect(() => {
    const loadData = async () => {
      const equipageData = await getEquipages();
      setEquipage(equipageData);
      await fetchOrganisation();
    };

    loadData();
  }, []);

  // --- HANDLERS ---
  const handleCreateOrganisation = async (data: CreateOrg) => {
    await createOrganisation(data);
    setIsModalOpen(false);
    await fetchOrganisation();
  };

  const handleDeleteOrganisation = async (id: number) => {
    if (!confirm("Supprimer cette Organisation ?")) return;
    await deleteOrganisation(id);
    await fetchOrganisation();
  };
  const handleOpenPageModal = (organisation: any) => {
    setSelectedEntity({ id: organisation.id, name: organisation.name });
    setIsModalPageOpen(true);
  };
  const handleFinalSubmit = async (formData: any) => {
    try {
      await createPage(formData);
      alert("L'article One Piece a été publié !");
      setIsModalOpen(false);
      fetchOrganisation();
    } catch (error) {
      alert("Erreur : " + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic uppercase">
              Les Organisations
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
          {organisation.length === 0 ? (
            <div className="bg-white p-10 rounded-4xl text-center border border-dashed border-gray-300 text-gray-400 font-bold">
              Aucune organisation trouvé.
            </div>
          ) : (
            organisation.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between bg-white p-4 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 overflow-hidden">
                    {o.image && o.image.length > 0 ? (
                      <img
                        src={o.image[0].url}
                        className="h-full w-full object-cover"
                        alt={o.name}
                      />
                    ) : (
                      <Apple className="text-purple-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-black italic uppercase text-lg">
                      {o.name}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenPageModal(o)}
                    className={
                      o.hasPage ? "text-green-500" : "text-blue-500"
                    }
                  >
                    {o.hasPage ? "l'organisation à déjà une page": "Rédiger"}
                  </button>
                  <button
                    onClick={() => handleDeleteOrganisation(o.id)}
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
              <h2 className="text-2xl font-black italic">NOUVEAU ARC</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-gray-100 rounded-full hover:bg-red-50 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <OrganisationForm
              onSubmit={handleCreateOrganisation}
              onCancel={() => setIsModalOpen(false)}
              equipages={equipage}
            />
          </div>
        </div>
      )}
      {isModalPageOpen && selectedEntity && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* L'arrière-plan sombre (Overlay) */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* La boîte de la modale */}
          <div className="relative bg-white w-full max-w-2xl rounded-4xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Nouvel article :{" "}
                <span className="text-blue-600">{selectedEntity.name}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                Fermer
              </button>
            </div>
            <PageForm
              entityId={selectedEntity.id}
              entityType="ORGANISATION"
              initialTitle={selectedEntity.name}
              onSubmit={handleFinalSubmit}
              onCancel={() => setIsModalPageOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
