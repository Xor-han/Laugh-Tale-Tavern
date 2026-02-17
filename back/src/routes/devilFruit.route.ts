import express, { Request, Response } from "express";
import db from "@/lib/db";

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
    res.status(500).json({ message: "Erreur lors du remplacement du fruit", error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, image, type } = req.body;

    const fruit = await db.devilFruit.findUnique({
      where: { id: Number(id) },
    });

    if (!fruit) {
      return res.status(404).json({ message: "Fruit non trouvé" });
    }

    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = name;
    }
    if (image !== undefined) {
      updateData.Image = image; 
    }
    if (type !== undefined) {
      updateData.type = type;
    }

    const updatedFruit = await db.devilFruit.update({
      where: { id: Number(id) },
      data: updateData
    });

    res.json(updatedFruit);
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
    res.status(500).json({ message: "Impossible de supprimer ce fruit s'il est utilisé", error });
  }
});

export default router;
