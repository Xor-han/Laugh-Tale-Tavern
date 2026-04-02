import type {
  Organisation,
  OrgUpdate,
  CreateOrg,
} from "../interfaces/organisation.interface";

const API_URL = "http://localhost:3000";

export const getOrganisations = async (): Promise<Organisation[]> => {
  const res = await fetch(`${API_URL}/organisations`, {
    credentials: "include",
  });
  if (!res.ok)
    throw new Error("Erreur lors de la récupération des organisations");
  return res.json();
};

export const getOrganisationById = async (
  id: number,
): Promise<Organisation> => {
  const res = await fetch(`${API_URL}/organisations/id/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du fruit");
  return res.json();
};
export const getOrganisationBySlug = async (
  slug: string,
): Promise<Organisation> => {
  const res = await fetch(`${API_URL}/organisations/${slug}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Erreur lors de la récupération du fruit");
  return res.json();
};

export const createOrganisation = async (
  org: CreateOrg,
): Promise<Organisation> => {
  const res = await fetch(`${API_URL}/organisations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(org),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'organisation");
  return res.json();
};

export const putOrganisation = async (
  id: number,
  org: CreateOrg,
): Promise<Organisation> => {
  const res = await fetch(`${API_URL}/organisations/id/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(org),
  });
  if (!res.ok) throw new Error("Erreur lors du remplacement de l'organisation");
  return res.json();
};

export const updateOrganisation = async (
  id: number,
  org: OrgUpdate,
): Promise<Organisation> => {
  const res = await fetch(`${API_URL}/organisations/id/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(org),
  });
  if (!res.ok)
    throw new Error("Erreur lors de la modification de l'organisation");
  return res.json();
};

export const deleteOrganisation = async (id: number): Promise<void> => {
  const res = await fetch(`${API_URL}/organisations/id/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok)
    throw new Error("Erreur lors de la suppression de l'organisation");
};
