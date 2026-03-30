import type {
  Crew,
  CreateCrew,
  CrewUpdate,
} from "../interfaces/equipage.interface";

const API_URL = "http://localhost:3000";

export const getEquipages = async (): Promise<Crew[]> => {
  const res = await fetch(`${API_URL}/crews`, { credentials: "include" });
  if (!res.ok) throw new Error("Erreur lors de la récupération des équipages");
  return res.json();
};

export const createEquipage = async (
  equipage: CreateCrew,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crew`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(equipage),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'équipage");
  return res.json();
};

export const putEquipage = async (
  id: number,
  equipage: CreateCrew,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crew/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(equipage),
  });
  if (!res.ok) throw new Error("Erreur lors du remplacement de l'équipage");
  return res.json();
};

export const updateEquipage = async (
  id: number,
  equipage: CrewUpdate,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crew/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(equipage),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification de l'équipage");
  return res.json();
};

export const deleteEquipage = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/crew/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'équipage");
};
