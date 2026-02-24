import type {Equipage, EquipageUpdate, CreateEquipage} from "../interfaces/equipage.interface"

const API_URL = "http://localhost:3000";

export const getEquipages = async (): Promise<Equipage[]> => {
    const res = await fetch(`${API_URL}/equipages`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des équipages");
    return res.json();
};

export const createEquipage = async (equipage: CreateEquipage): Promise<Equipage> => {
    const res = await fetch(`${API_URL}/equipages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(equipage),
    });
    if (!res.ok) throw new Error("Erreur lors de la création de l'équipage");
    return res.json();
};

export const putEquipage = async (id: number, equipage: CreateEquipage): Promise<Equipage> => {
    const res = await fetch(`${API_URL}/equipages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(equipage),
    });
    if (!res.ok) throw new Error("Erreur lors du remplacement de l'équipage");
    return res.json();
};

export const updateEquipage = async (id: number, equipage: EquipageUpdate): Promise<Equipage> => {
    const res = await fetch(`${API_URL}/equipages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(equipage),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification de l'équipage");
    return res.json();
};

export const deleteEquipage = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/equipages/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression de l'équipage");
};