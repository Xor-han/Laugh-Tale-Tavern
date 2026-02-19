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

router.get("/", async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const pages = await db.page.findMany();
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { slug } = req.params;
    const page = await db.page.findUnique({
      where: { slug },
      include: {
        comments: {
          where: { parentId: null },
          include: {
            author: true,
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

router.put("/pages/:id", async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    const { slug, content } = req.body;

    const updatedPage = await db.page.update({
      where: { id: Number(id) },
      data: {
        slug: slug,
        content: content,
      },
    });
    res.json(updatedPage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.patch("/pages/:id", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;

    const existing = await db.page.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Page not found" });
    }

    const { slug, content } = req.body;

    const data: {
      slug?: string;
      content?: string;
    } = {};

    if (slug !== undefined) {
      data.slug = slug;
    }

    if (content !== undefined) {
      data.content = content;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucun champs à modifier",
      });
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

router.delete("/pages/:id", async (req, res) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    await db.page.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
