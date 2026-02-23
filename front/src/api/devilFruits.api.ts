import type {DevilFruit, FruitUpdate, CreateFruit} from "../interfaces/devilFruit.interface"

const API_URL = "http://localhost:3000";


// GET ALL
export const getFruits = async (): Promise<DevilFruit[]> => {
    const res = await fetch(`${API_URL}/fruits`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des fruits");
    return res.json();
};

// GET ONE
export const getFruitById = async (id: number): Promise<DevilFruit> => {
    const res = await fetch(`${API_URL}/fruits/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération du fruit");
    return res.json();
};

// POST (Création)
export const createFruit = async (fruit: CreateFruit): Promise<DevilFruit> => {
    const res = await fetch(`${API_URL}/fruits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(fruit),
    });
    if (!res.ok) throw new Error("Erreur lors de la création du fruit");
    return res.json();
};

// PUT (Remplacement complet)
export const putFruit = async (id: number, fruit: CreateFruit): Promise<DevilFruit> => {
    const res = await fetch(`${API_URL}/fruits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(fruit),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour complète du fruit");
    return res.json();
};

// PATCH (Modification partielle)
export const updateFruit = async (id: number, fruit: FruitUpdate): Promise<DevilFruit> => {
    const res = await fetch(`${API_URL}/fruits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(fruit),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification du fruit");
    return res.json();
};

// DELETE
export const deleteFruit = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/fruits/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression du fruit");
};