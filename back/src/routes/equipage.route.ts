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
    const data = await db.equipages.findMany({
      include: {
        _count: {
          select: { onePieceCharacter: true },
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fruit = await db.equipages.findUnique({
      where: { id: Number(id) },
      include: {
        _count: {
          select: { onePieceCharacter: true },
        },
      },
    });

    if (!fruit) return res.status(404).json({ message: "Fruit non trouvé" });
    res.json(fruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Le nom de l'équipage est obligatoire" });
    }

    const newEquipage = await db.equipages.create({
      data: { name },
    });

    res.status(201).json(newEquipage);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
});

router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Le champ name est obligatoire pour une mise à jour complète",
      });
    }

    const existing = await db.equipages.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Équipage non trouvé" });
    }

    const updatedEquipage = await db.equipages.update({
      where: { id: Number(id) },
      data: {
        name: name,
      },
    });

    res.status(200).json(updatedEquipage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.patch("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;

    const existing = await db.equipages.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Équipage non trouvé" });
    }

    const { name } = req.body;

    const data: {
      name?: string;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucun champs à modifier" });
    }

    const updatedEquipage = await db.equipages.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(updatedEquipage);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const { id } = req.params;

    await db.equipages.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur de suppression" });
  }
});

export default router;
