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
    const data = await db.type.findMany({
      include: {
        _count: { select: { devilFruit: true } },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const data = await db.type.findUnique({
      where: { id: Number(id) },
      include: {
        devilFruit: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!data) {
      return res.status(404).json({ message: "Type de fruit non trouvé" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Le nom du type est requis" });

    const newType = await db.type.create({
      data: { name },
    });
    res.status(201).json(newType);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Le nom est obligatoire" });

    const updatedType = await db.type.update({
      where: { id: Number(id) },
      data: { name },
    });
    res.status(200).json(updatedType);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.patch("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;
    const existing = await db.type.findUnique({ where: { id: Number(id) } });

    if (!existing) return res.status(404).json({ message: "Type non trouvé" });

    const { name } = req.body;
    const data: { name?: string } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucun champ à modifier" });
    }

    const updated = await db.type.update({
      where: { id: Number(id) },
      data,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;

    await db.type.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur : Vérifiez que ce type n'est pas utilisé par des fruits du démon avant de le supprimer",
      error,
    });
  }
});

export default router;
