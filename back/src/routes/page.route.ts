import express, { Request, Response } from "express";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { isAdmin } from "@/middleware/isAdmin";

const router: express.Router = express.Router();
const getUserId = async (req: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const pages = await db.page.findMany({
      orderBy: { createdAt: "desc" },
    });
    const pagesWithData = await Promise.all(
      pages.map(async (page) => {
        let entityData: any = null;

        switch (page.entityType) {
          case "CHARACTER":
            entityData = await db.onePieceCharacter.findUnique({
              where: { id: page.entityId },
              include: { image: true },
            });
            break;
          case "ARC":
            entityData = await db.arcs.findUnique({
              where: { id: page.entityId },
              include: { image: true },
            });
            break;
          case "FRUIT":
            entityData = await db.devilFruit.findUnique({
              where: { id: page.entityId },
              include: { image: true },
            });
            break;
          case "ORGANISATION":
            entityData = await db.organisation.findUnique({
              where: { id: page.entityId },
              include: { image: true },
            });
            break;
        }

        return {
          ...page,
          entityData,
        };
      }),
    );
    res.json(pagesWithData);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = await db.page.findUnique({
      where: { slug: slug as string },
      include: {
        comments: {
          where: { parentId: null },
          orderBy: {createdAt: "desc"},
          include: {
            author: true,
            replies: {
              include: { author: true },
            },
          },
        },
      },
    });
    if (!page) return res.status(404).json({ message: "Page non trouvée" });
    const character = await db.onePieceCharacter.findUnique({
      where: { id: page.entityId },
      include: { image: true, devilFruit: true, equipage: true, organisation: true },
    });


    res.json({
      ...page,
      character,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { slug, title, content, entityId, entityType } = req.body;

    if (!slug || !content || !title) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const existingLink = await db.page.findFirst({
      where: { entityId: Number(entityId), entityType },
    });
    if (existingLink)
      return res
        .status(400)
        .json({ message: "Une page existe déjà pour cette entité" });

    const newPage = await db.page.create({
      data: {
        slug: slug.toLowerCase().trim().replace(/\s+/g, "-"),
        title,
        content,
        entityId: Number(entityId),
        entityType,
      },
    });

    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;
    const { slug, content } = req.body;

    if (!slug || !content) {
      return res
        .status(400)
        .json({ message: "Slug et Content sont obligatoires pour un PUT" });
    }

    const updatedPage = await db.page.update({
      where: { id: Number(id) },
      data: { slug, content },
    });
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.patch("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;

    const existing = await db.page.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) return res.status(404).json({ message: "Page not found" });

    const { slug, content } = req.body;
    const data: { slug?: string; content?: string } = {};

    if (slug !== undefined) data.slug = slug;
    if (content !== undefined) data.content = content;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucun champs à modifier" });
    }

    const updatedPage = await db.page.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;

    const check = await db.page.findUnique({ where: { id: Number(id) } });
    if (!check) return res.status(404).json({ message: "Page introuvable" });

    await db.page.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
