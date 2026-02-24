import type { Arc, ArcUpdate, CreateArc } from "../interfaces/arc.interface";

const API_URL = "http://localhost:3000";

export const getArcs = async (): Promise<Arc[]> => {
  const res = await fetch(`${API_URL}/arcs`, { credentials: "include" });
  if (!res.ok) throw new Error("Erreur lors de la récupération des arcs");
  return res.json();
};

export const createArc = async (arc: CreateArc): Promise<Arc> => {
  const res = await fetch(`${API_URL}/arcs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(arc),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'arc");
  return res.json();
};

export const putArc = async (id: number, arc: CreateArc): Promise<Arc> => {
  const res = await fetch(`${API_URL}/arcs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(arc),
  });
  if (!res.ok) throw new Error("Erreur lors du remplacement de l'arc");
  return res.json();
};

export const updateArc = async (id: number, arc: ArcUpdate): Promise<Arc> => {
  const res = await fetch(`${API_URL}/arcs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(arc),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification de l'arc");
  return res.json();
};

export const deleteArc = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/arcs/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'arc");
};
