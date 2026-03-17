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
    const data = await db.arcs.findMany({
      include: {
        onePieceCharacter: { select: { name: true } },
        image: true,
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
        onePieceCharacter: { select: { name: true } },
        image: true,
      },
    });
    if (!data) {
      return res.status(404).json({ message: "Arc non trouvé" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { name, imageId } = req.body;
    if (!name || !imageId) {
      return res
        .status(400)
        .json({
          message:
            "Les champs name, imageUrl et imagePublicId sont obligatoires",
        });
    }

    const data = await db.arcs.create({
      data: {
        name,
        image: {
          connect: { id: imageId },
        },
      },
    });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;
    const { name, imageId} = req.body;

    if (!name || !imageId) {
      return res
        .status(400)
        .json({
          message:
            "Les champs name, imageUrl et imagePublicId sont obligatoires",
        });
    }

    const data = await db.arcs.update({
      where: { id: Number(id) },
      data: {
        name,
        },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

router.patch("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, imagePublicId } = req.body;

    const data: {
      name?: string;
      image?: any;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (imageUrl !== undefined && imagePublicId !== undefined) {
      data.image = {
        upsert: {
          create: { url: imageUrl, publicId: imagePublicId },
          update: { url: imageUrl, publicId: imagePublicId },
        },
      };
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucun champ à modifier",
      });
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

router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const arc = await db.arcs.findUnique({
      where: { id: Number(id) },
      include: { image: true },
    });

    if (!arc) return res.status(404).json({ message: "Arc introuvable" });

    if (arc.image[0]?.publicId) {
      await cloudinary.uploader.destroy(arc.image[0].publicId);
      await db.image.delete({ where: { id: arc.image[0].id! } });
    }

    await db.arcs.delete({ where: { id: Number(id) } });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
