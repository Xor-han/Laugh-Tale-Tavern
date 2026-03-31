import db from "@/lib/db";
import type { GetArticlesQuery } from "@/dtos/article.dto";

/**
 * Récupère tous les articles (union des 5 entités) avec filtrage et tri
 */
export const getAllArticles = async (params: GetArticlesQuery) => {
  const { type, search, order = "asc" } = params;

  const select = {
    id: true,
    name: true,
    slug: true,
    content: true,
    image: { select: { id: true, url: true, publicId: true } },
  };

  const nameFilter = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const fetchers = {
    characters: async () =>
      (await db.onePieceCharacter.findMany({ select, where: nameFilter })).map(
        (c) => ({ ...c, type: "characters" as const }),
      ),
    devilFruits: async () =>
      (await db.devilFruit.findMany({ select, where: nameFilter })).map(
        (f) => ({ ...f, type: "devilFruits" as const }),
      ),
    arcs: async () =>
      (await db.arcs.findMany({ select, where: nameFilter })).map((a) => ({
        ...a,
        type: "arcs" as const,
      })),
    crews: async () =>
      (await db.crews.findMany({ select, where: nameFilter })).map((c) => ({
        ...c,
        type: "crews" as const,
      })),
    organisations: async () =>
      (await db.organisation.findMany({ select, where: nameFilter })).map(
        (o) => ({ ...o, type: "organisations" as const }),
      ),
  };

  let articles;

  if (type) {
    articles = await fetchers[type]();
  } else {
    const results = await Promise.all(Object.values(fetchers).map((fn) => fn()));
    articles = results.flat();
  }

  articles.sort((a, b) =>
    order === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name),
  );

  return articles;
};
