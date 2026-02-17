import express, { Request, Response } from "express";
import db from "@/lib/db";
import { Type } from "@prisma/client";

const router: express.Router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await db.devilFruit.findMany({
      orderBy: { name: "desc" },
      include: { onePieceCharacters: true },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const fruit = await db.devilFruit.findUnique({
      where: { id: Number(id) },
      include: { onePieceCharacters: true },
    });

    if (!fruit) return res.status(404).json({ message: "Fruit non trouvé" });
    res.json(fruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: "Le nom et le type sont obligatoires pour une mise à jour complète" });
    }

    const updatedFruit = await db.devilFruit.update({
      where: { id: Number(id) },
      data: {
        name: name,
        Image: image || null,
        type: type     
      }
    });

    res.json(updatedFruit);
  } catch (error) {
    res.status(500).json({message: "Erreur serveur", error});
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const existing = await db.devilFruit.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!existing) {
      return res.status(404).json({ message: "Fruit du démon non trouvé" });
    }

    const { name, Image, type } = req.body;

    const data: {
      name?: string;
      Image?: string | null;
      type?: Type;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (Image !== undefined) {
      data.Image = Image;
    }

    if (type !== undefined) {
      data.type = type;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucun champs à modifier"
      });
    }

    const updatedFruit = await db.devilFruit.update({
      where: { id: Number(id) },
      data
    });

    res.status(200).json(updatedFruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.devilFruit.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: "Erreur serveur", error });
  }
});

export default router;
