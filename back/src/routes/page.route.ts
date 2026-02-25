import express, { Request, Response } from "express";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router: express.Router = express.Router();
const getUserId = async (req: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
};

router.get("/", async (req : Request, res : Response) => {
  try {
    const pages = await db.page.findMany();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get("/:slug", async (req : Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = await db.page.findUnique({
      where: { slug : slug as string},
      include: {
        comments: {
          where: { parentId: null },
          include: {
            author: true,
            replies: { 
              include: { author: true }
            }
          },
        },
      },
    });

    if (!page) return res.status(404).json({ message: "Page non trouvée" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { slug, content } = req.body;

    if (!slug || !content) {
      return res.status(400).json({
        message: "Les champs slug et content sont obligatoires",
      });
    }

    const existingPage = await db.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return res.status(400).json({
        message: "Une page avec ce slug existe déjà",
      });
    }

    const newPage = await db.page.create({
      data: {
        slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
        content: content,
      },
    });

    res.status(201).json(newPage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la création", error });
  }
});

router.put("/:id", async (req : Request, res: Response) => { // Correction du path
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;
    const { slug, content } = req.body;

    if (!slug || !content) {
      return res.status(400).json({ message: "Slug et Content sont obligatoires pour un PUT" });
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

router.patch("/:id", async (req: Request, res: Response) => { // Correction du path
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;

    const existing = await db.page.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) return res.status(404).json({ message: "Page not found" });

    const { slug, content } = req.body;
    const data: { slug?: string; content?: string; } = {};

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

router.delete("/:id", async (req : Request, res : Response) => {
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
