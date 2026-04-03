import type {
  DevilFruit,
  FruitUpdate,
  CreateFruit,
} from "../interfaces/devilFruit.interface";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getFruits = async (): Promise<DevilFruit[]> => {
  const res = await fetch(`${API_URL}/devilFruits`, { credentials: "include" });
  if (!res.ok) throw new Error("Erreur lors de la récupération des fruits");
  return res.json();
};

export const getDevilFruitById = async (
  id: number,
): Promise<DevilFruit> => {
  const res = await fetch(`${API_URL}/devilFruits/id/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du fruit");
  return res.json();
};
export const getDevilFruitBySlug = async (
  slug: string,
): Promise<DevilFruit> => {
  const res = await fetch(`${API_URL}/devilFruits/${slug}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du fruit");
  return res.json();
};

export const createFruit = async (fruit: CreateFruit): Promise<DevilFruit> => {
  const res = await fetch(`${API_URL}/devilFruits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(fruit),
  });
  if (!res.ok) throw new Error("Erreur lors de la création du fruit");
  return res.json();
};

export const putFruit = async (
  id: number,
  fruit: CreateFruit,
): Promise<DevilFruit> => {
  const res = await fetch(`${API_URL}/devilFruits/id/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(fruit),
  });
  if (!res.ok)
    throw new Error("Erreur lors de la mise à jour complète du fruit");
  return res.json();
};

export const updateFruit = async (
  id: number,
  fruit: FruitUpdate,
): Promise<DevilFruit> => {
  const res = await fetch(`${API_URL}/devilFruits/id/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(fruit),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification du fruit");
  return res.json();
};

export const deleteFruit = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/devilFruits/id/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du fruit");
};
