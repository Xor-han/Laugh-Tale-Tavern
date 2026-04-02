import type {
  Crew,
  CreateCrew,
  CrewUpdate,
} from "../interfaces/equipage.interface";

const API_URL = "http://localhost:3000";

export const getCrews = async (): Promise<Crew[]> => {
  const res = await fetch(`${API_URL}/crews`, { credentials: "include" });
  if (!res.ok) throw new Error("Erreur lors de la récupération des équipages");
  return res.json();
};

export const getCrewById = async (
  id: number,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crews/id/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du fruit");
  return res.json();
};
export const getCrewBySlug = async (
  slug: string,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crews/${slug}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du fruit");
  return res.json();
};

export const createCrew = async (
  equipage: CreateCrew,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(equipage),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'équipage");
  return res.json();
};

export const putCrew = async (
  id: number,
  equipage: CreateCrew,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crews/id/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(equipage),
  });
  if (!res.ok) throw new Error("Erreur lors du remplacement de l'équipage");
  return res.json();
};

export const updateCrew = async (
  id: number,
  equipage: CrewUpdate,
): Promise<Crew> => {
  const res = await fetch(`${API_URL}/crews/id/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(equipage),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification de l'équipage");
  return res.json();
};

export const deleteCrew = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/crews/id/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'équipage");
};
