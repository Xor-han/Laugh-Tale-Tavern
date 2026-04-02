import type {
  OnePieceCharacter,
  CharacterUpdate,
  CreateCharacter,
} from "../interfaces/onePieceCharacter.interface";

const API_URL = "http://localhost:3000";

export const getCharacters = async (): Promise<OnePieceCharacter[]> => {
  const res = await fetch(`${API_URL}/characters`, { credentials: "include" });
  if (!res.ok)
    throw new Error("Erreur lors de la récupération des personnages");
  return res.json();
};

export const getCharacterById = async (
  id: number,
): Promise<OnePieceCharacter> => {
  const res = await fetch(`${API_URL}/characters/id/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du personnage");
  return res.json();
};
export const getCharacterBySlug = async (
  slug: string,
): Promise<OnePieceCharacter> => {
  const res = await fetch(`${API_URL}/characters/${slug}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du personnage");
  return res.json();
};

export const createCharacter = async (
  character: CreateCharacter,
): Promise<OnePieceCharacter> => {
  const res = await fetch(`${API_URL}/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(character),
  });
  if (!res.ok) throw new Error("Erreur lors de la création du personnage");
  return res.json();
};

export const putCharacter = async (
  id: number,
  character: CreateCharacter,
): Promise<OnePieceCharacter> => {
  const res = await fetch(`${API_URL}/characters/id/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(character),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(
      errorData.message || "Erreur lors du remplacement complet du personnage",
    );
  }

  return res.json();
};

export const updateCharacter = async (
  id: number,
  character: CharacterUpdate,
): Promise<OnePieceCharacter> => {
  const res = await fetch(`${API_URL}/characters/id/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(character),
  });
  if (!res.ok) throw new Error("Erreur lors de la modification du personnage");
  return res.json();
};

export const deleteCharacter = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/characters/id/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression du personnage");
};
