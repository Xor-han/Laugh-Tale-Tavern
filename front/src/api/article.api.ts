import type { Article } from "../interfaces/article.interface";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getArticles = async (params?: {
  type?: Article["type"];
  search?: string;
  order?: "asc" | "desc";
}): Promise<Article[]> => {
  const query = new URLSearchParams();
  if (params?.type) query.set("type", params.type);
  if (params?.search) query.set("search", params.search);
  if (params?.order) query.set("order", params.order);

  const queryString = query.toString();
  const url = `${API_URL}/articles${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Erreur lors de la récupération des articles");
  return res.json();
};
