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
    const { id } = req.params;
    const { content } = req.body;
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    if (!content) {
      return res.status(400).json({ message: "Le contenu est obligatoire" });
    }

    const comment = await db.comment.findUnique({
      where: { id: id as string },
    });

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({
        message: "Vous n'avez pas l'autorisation de modifier ce commentaire",
      });
    }

    // 2. Mise à jour
    const updatedComment = await db.comment.update({
      where: { id: id as string },
      data: {
        content: content,
      },
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
    });

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Erreur Serveur", error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = await getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const comment = await db.comment.findUnique({
      where: { id: id as string },
      select: { authorId: true },
    });

    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé" });
    }

    if (comment.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Action interdite : vous n'êtes pas l'auteur" });
    }

  
    const updatedComment = await db.comment.update({
      where: { id: id as string },
      data: {
        ...(content && { content }),
      },
    });

    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = await getUserId(req);

    const comment = await db.comment.findUnique({
      where: { id: id as string },
    });

    if (!comment) return res.status(404).json({ message: "Introuvable" });

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: "Action interdite" });
    }

    await db.comment.delete({
      where: { id: id as string },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
