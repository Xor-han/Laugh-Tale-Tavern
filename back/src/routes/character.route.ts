import express, { Request, Response } from "express";
import db from "@/lib/db";
import { Profession } from "@prisma/client";
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
    const data = await db.onePieceCharacter.findMany({
      include: {
        image: true,
        devilFruit: { select: { name: true } },
        organisation: { select: { name: true } },
        equipage: { select: { name: true } },
        arcs: { select: { name: true } },
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
    const data = await db.onePieceCharacter.findUnique({
      where: { id: Number(id) },
      include: {
        image: true,
        devilFruit: true,
        organisation: true,
        equipage: true,
        arcs: true,
      },
    });
    if (!data)
      return res.status(404).json({ message: "Personnage non trouvé" });
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
    const {
      name,
      imageId,
      isAlive,
      profession,
      devilFruit_id,
      organisationId,
      equipageId,
      arcIds,
    } = req.body;

    if (!name || !imageId || isAlive === undefined || !profession) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const data = await db.onePieceCharacter.create({
      data: {
        name,
        isAlive: isAlive,
        profession: profession as Profession,
        image: {
          connect: { id: imageId },
        },
        devilFruit_id: devilFruit_id || null,
        organisationId: organisationId || null,
        equipageId: equipageId || null,
        arcs: {
          connect: arcIds.map((id: number) => ({ id })),
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
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    const {
      name,
      isAlive,
      profession,
      devilFruit_id,
      organisationId,
      equipageId,
      arcIds,
      imageId,
    } = req.body;

    const data = await db.onePieceCharacter.update({
      where: { id: Number(id) },
      data: {
        name,
        isAlive: isAlive ?? null,
        profession: profession as Profession,
        devilFruit_id: devilFruit_id || null,
        organisationId: organisationId || null,
        equipageId: equipageId || null,
        image: {
          connect: { id: imageId },
        },
        arcs: {
          connect: arcIds.map((id: number) => ({ id })),
        },
      },
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
});

router.patch("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    const {
      name,
      imageUrl,
      imagePublicId,
      isAlive,
      profession,
      devilFruit_id,
      organisationId,
      equipageId,
      arcId,
    } = req.body;

    const data: {
      name?: string;
      isAlive?: boolean;
      profession?: Profession;
      image?: any;
      devilFruit_id?: number | null;
      organisationId?: number | null;
      equipageId?: number | null;
      arcId?: number | null;
    } = {};

    if (name !== undefined) data.name = name;
    if (isAlive !== undefined) data.isAlive = isAlive;
    if (profession !== undefined) data.profession = profession as Profession;

    if (imageUrl !== undefined && imagePublicId !== undefined) {
      data.image = {
        upsert: {
          create: { url: imageUrl, publicId: imagePublicId },
          update: { url: imageUrl, publicId: imagePublicId },
        },
      };
    }

    if (devilFruit_id !== undefined) {
      data.devilFruit_id = devilFruit_id;
    }
    if (organisationId !== undefined) {
      data.organisationId = organisationId;
    }
    if (equipageId !== undefined) {
      data.equipageId = equipageId;
    }
    if (arcId !== undefined) {
      data.arcId = arcId;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucun champ à modifier" });
    }
    const updated = await db.onePieceCharacter.update({
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
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const character = await db.onePieceCharacter.findUnique({
      where: { id: Number(req.params.id) },
      include: { image: true },
    });

    if (character?.image[0]?.publicId) {
      await cloudinary.uploader.destroy(character.image[0].publicId);
      await db.image.delete({ where: { id: character.image[0].id! } });
    }

    await db.onePieceCharacter.delete({ where: { id: Number(req.params.id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
