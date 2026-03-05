import { useState, useEffect } from "react";
import { getCharacters, deleteCharacter, createCharacter, updateCharacter } from "../api/onePieceCharacter.api";
import type { OnePieceCharacter } from "../interfaces/onePieceCharacter.interface";
import { Edit2, Trash2, Plus, X } from "lucide-react";
import { CharacterForm } from "../components/CharacterForm.tsx";

export const AdminDashboard = () => {
  const [characters, setCharacters] = useState<OnePieceCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Stocke le personnage à modifier, ou null pour une création
  const [editingCharacter, setEditingCharacter] = useState<OnePieceCharacter | null>(null);

  const loadCharacters = async () => {
    try {
      const data = await getCharacters();
      setCharacters(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCharacters(); }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Supprimer ce personnage ?")) {
      await deleteCharacter(id);
      loadCharacters();
    }
  };

  const handleOpenAdd = () => {
    setEditingCharacter(null); // Reset pour création
    setIsModalOpen(true);
  };

  const handleOpenEdit = (char: OnePieceCharacter) => {
    setEditingCharacter(char); // Set pour édition
    setIsModalOpen(true);
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-medium">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header avec bouton Ajouter */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Personnages</h1>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl hover:bg-zinc-800 transition-all shadow-md"
          >
            <Plus size={20} /> Ajouter
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {characters.map((char) => (
            <div key={char.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition">
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800">{char.name}</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">{char.profession}</span>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${char.isAlive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {char.isAlive ? 'ACTIF' : 'DÉCÉDÉ'}
                </span>
                
                <div className="flex gap-2">
                  <button onClick={() => handleOpenEdit(char)} className="p-2 hover:bg-blue-50 rounded-lg text-gray-500 hover:text-blue-600 transition">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(char.id)} className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingCharacter ? `Modifier ${editingCharacter.name}` : "Nouveau Personnage"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <CharacterForm 
                initialData={editingCharacter || undefined} 
                onSubmit={async (data) => {
                    if (editingCharacter) {
                        // Logique Update (tu devras peut-être adapter selon ton API)
                        await updateCharacter(editingCharacter.id, data);
                    } else {
                        // Logique Create
                        await createCharacter(data);
                    }
                    setIsModalOpen(false);
                    loadCharacters();
                }}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};