import express, { Request, Response } from "express";
import db from "@/lib/db";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { isAdmin } from "@/middleware/isAdmin";
import cloudinary from "@/lib/cloudinary";

const router: express.Router = express.Router();
const getUserId = async (req: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
};
router.get("/", async (req: Request, res: Response) => {
  try {
    const data = await db.devilFruit.findMany({
      orderBy: { name: "desc" },
      include: { onePieceCharacters: true, image: true, type: true },
    });
    const pages = await db.page.findMany({
      where: { entityType: "FRUIT" },
      select: { entityId: true },
    });

    const fruitIdsWithPage = new Set(pages.map((p) => p.entityId));

    const results = data.map((fruit) => ({
      ...fruit,
      hasPage: fruitIdsWithPage.has(fruit.id),
    }));

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fruit = await db.devilFruit.findUnique({
      where: { id: Number(id) },
      include: { onePieceCharacters: true, image: true, type: true },
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
    if (!userId) return res.status(401).json({ message: "Non authentifié" });
    const { name, imageId, typeId } = req.body;
    if (!name || !typeId) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires (name et typeId).",
      });
    }
    const newFruit = await db.devilFruit.create({
      data: {
        name: name,
        type: {
          connect: { id: Number(typeId) },
        },
        image: {
          connect: { id: imageId },
        },
      },
      include: {
        type: true,
        image: true,
      },
    });

    res.status(201).json(newFruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    const { name, typeId } = req.body;

    if (!name || !typeId) {
      return res.status(400).json({
        message:
          "Le nom et le type sont obligatoires pour une mise à jour complète",
      });
    }

    const updatedFruit = await db.devilFruit.update({
      where: { id: Number(id) },
      data: {
        name: name,
        typeId: typeId,
      },
    });

    res.json(updatedFruit);
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

    const existing = await db.devilFruit.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!existing) {
      return res.status(404).json({ message: "Fruit du démon non trouvé" });
    }

    const { name, typeId } = req.body;

    const data: {
      name?: string;
      image?: any;
      typeId?: number;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (typeId !== undefined) {
      data.typeId = Number(typeId);
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucun champs à modifier",
      });
    }

    const updatedFruit = await db.devilFruit.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(updatedFruit);
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
    const fruit = await db.devilFruit.findUnique({
      where: { id: Number(id) },
      include: { image: true },
    });
    if (fruit?.image[0]?.id) {
      await cloudinary.uploader.destroy(fruit.image[0].publicId);
      await db.image.delete({ where: { id: fruit.image[0].id! } });
    }
    await db.devilFruit.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
