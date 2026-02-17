import express, { Request, Response } from "express";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { number, string } from "better-auth";
import { connect } from "node:http2";

const router: express.Router = express.Router();

const getUserId = async (req: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
};

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const data = await db.comment.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;

    const data = await db.comment.findUnique({
      where: { id: String(id) },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});

router.get("/:id/replies", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const replies = await db.comment.findMany({
      where: {
        parentId: id as string,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json(replies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des réponses", error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { content, pageId, parentId } = req.body;

    if (!content || !pageId) {
      return res
        .status(400)
        .json({ message: "Le contenu et l'ID de la page sont obligatoires" });
    }

    const newComment = await db.comment.create({
      data: {
        content,
        page: {
          connect: { id: Number(pageId) },
        },
        author: {
          connect: { id: userId },
        },
        ...(parentId && {
          parent: {
            connect: { id: parentId },
          },
        }),
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: "Le champ comment est obligatoire",
      });
    }

    const data = await db.comment.update({
      where: { id: String(id) },
      data: {
        content,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;

    const existing = await db.comment.findUnique({
      where: {
        id: String(id),
      },
    });
    if (!existing || existing.authorId !== userId) {
      return res.status(404).json({ message: "Note not found" });
    }

    const { content } = req.body;

    const data: {
      content?: string;
    } = {};

    if (content !== undefined) {
      data.content = content;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucun champs à modifier",
      });
    }

    const comment = await db.comment.update({
      where: { id: String(id) },
      data,
    });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;

    const existing = await db.comment.findUnique({
      where: {
        id: String(id),
      },
    });
    if (!existing || existing.authorId !== userId) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await db.comment.delete({
      where: { id: String(id) },
    });
    res.status(204).json("Commentaire supprimé avec succès");
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});
export default router;
