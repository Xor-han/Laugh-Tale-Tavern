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
    const data = await db.arcs.findMany({
      include: {
        onePieceCharacter: {
          select: { name: true },
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
    const { id } = req.params;
    const data = await db.arcs.findUnique({
      where: { id: Number(id) },
      include: {
        onePieceCharacter: {
          select: {
            name: true,
          },
        },
      },
    });
    if(!data){
      res.status(404).json({message:"Arc non trouvé"})
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        message: "Les champs name et image sont obligatoires",
      });
    }
    const data = await db.arcs.create({
      data: {
        name,
        image,
      },
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

// --- PUT (Update complet) ---
router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Les champs name et image sont obligatoires" });
    }

    const data = await db.arcs.update({
      where: { id: Number(id) },
      data: { name, image },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});

router.patch("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    const { name, image } = req.body;

    const arcs = await db.arcs.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!arcs) {
      return res.status(404).json({ message: "Arc non trouvé" });
    }
    const data: {
      name?: string;
      image?: string;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (image !== undefined) {
      data.image = image;
    }

    const arc = await db.arcs.update({
      where: { id: Number(id) },
      data,
    });
    res.status(200).json(arc);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// --- DELETE ---
router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;

    const arc = await db.arcs.findUnique({
      where: { id: Number(id) },
    });

    if (!arc) return res.status(404).json({ message: "Arc introuvable" });

    await db.arcs.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
