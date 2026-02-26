import type { Page, PageUpdate, CreatePage } from "../interfaces/page.interface";

const API_URL = "http://localhost:3000"

export const getPages = async (): Promise<Page[]> => {
    const res = await fetch(`${API_URL}/pages`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des pages");
    return res.json();
};

export const getPageBySlug = async (slug: string): Promise<Page> => {
    const res = await fetch(`${API_URL}/pages/${slug}`, { credentials: "include" });
    if (!res.ok) throw new Error("Erreur lors de la récupération de la page");
    return res.json();
};

export const createPage = async (page: CreatePage): Promise<Page> => {
    const res = await fetch(`${API_URL}/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(page),
    });
    if (!res.ok) throw new Error("Erreur lors de la création de la page");
    return res.json();
};

export const putPage = async (id: number, page: CreatePage): Promise<Page> => {
    const res = await fetch(`${API_URL}/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(page),
    });
    if (!res.ok) throw new Error("Erreur lors du remplacement de la page");
    return res.json();
};

export const updatePage = async (id: number, page: PageUpdate): Promise<Page> => {
    const res = await fetch(`${API_URL}/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(page),
    });
    if (!res.ok) throw new Error("Erreur lors de la modification de la page");
    return res.json();
};

export const deletePage = async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/pages/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) throw new Error("Erreur lors de la suppression de la page");
};