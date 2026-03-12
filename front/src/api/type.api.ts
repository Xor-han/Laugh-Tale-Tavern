import type {
  Type,
  TypeUpdate,
  CreateType,
} from "../interfaces/type.interface";

const API_URL = "http://localhost:3000";

export const getTypes = async (): Promise<Type[]> => {
  const res = await fetch(`${API_URL}/types`, { credentials: "include" });
  if (!res.ok)
    throw new Error("Erreur lors de la récupération des types de fruits");
  return res.json();
};

export const getTypeById = async (id: number): Promise<Type> => {
  const res = await fetch(`${API_URL}/types/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Erreur lors de la récupération du type");
  return res.json();
};

export const createType = async (type: CreateType): Promise<Type> => {
  const res = await fetch(`${API_URL}/types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(type),
  });
  if (!res.ok) throw new Error("Erreur lors de la création du type");
  return res.json();
};

export const putType = async (id: number, type: CreateType): Promise<Type> => {
  const res = await fetch(`${API_URL}/types/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(type),
  });
  if (!res.ok) throw new Error("Erreur lors du remplacement du type");
  return res.json();
};

export const updateType = async (
  id: number,
  type: TypeUpdate,
): Promise<Type> => {
  const res = await fetch(`${API_URL}/types/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(type),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification du type");
  return res.json();
};

export const deleteType = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/types/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du type");
};
