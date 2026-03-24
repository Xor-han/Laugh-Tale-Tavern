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
    const data = await db.organisation.findMany({
      include: {
        _count: { select: { onePieceCharacter: true } },
        equipage: { select: { name: true } },
        image: true,
      },
    });
    const pages = await db.page.findMany({
      where: { entityType: "ORGANISATION" },
      select: { entityId: true },
    });

    const organisationIdsWithPage = new Set(pages.map((p) => p.entityId));

    const results = data.map((organisation) => ({
      ...organisation,
      hasPage: organisationIdsWithPage.has(organisation.id),
    }));

    res.status(200).json(results);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await db.organisation.findUnique({
      where: { id: Number(id) },
      include: {
        onePieceCharacter: true,
        equipage: true,
        image: true,
      },
    });
    if (!data)
      return res.status(404).json({ message: "Organisation non trouvée" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { name, equipageIds, imageId } = req.body;
    if (!name)
      return res.status(400).json({ message: "Le nom est obligatoire" });

    const newOrg = await db.organisation.create({
      data: {
        name,
        equipage: {
          connect: equipageIds.map((id: number) => ({ id })),
        },
        image: {
          connect: { id: imageId },
        },
      },
    });
    res.status(201).json(newOrg);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.put("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;
    const { name, equipageIds, imageId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Le champ name est obligatoire" });
    }

    const updated = await db.organisation.update({
      where: { id: Number(id) },
      data: {
        name,
        equipage: {
          connect: equipageIds.map((id: number) => ({ id })),
        },
        image: {
          connect: { id: imageId },
        },
      },
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.patch("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const { id } = req.params;

    const existing = await db.organisation.findUnique({
      where: { id: Number(id) },
    });
    if (!existing)
      return res.status(404).json({ message: "Organisation non trouvée" });

    const { name, equipageId } = req.body;
    const data: { name?: string; equipageId?: number | null } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (equipageId !== undefined) {
      data.equipageId = equipageId !== null ? Number(equipageId) : null;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "Aucun champ à modifier" });
    }

    const updated = await db.organisation.update({
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
    const { id } = req.params;
    const organisation = await db.organisation.findUnique({
      where: { id: Number(id) },
      include: { image: true },
    });
    if (organisation?.image[0]?.id) {
      await cloudinary.uploader.destroy(organisation.image[0].publicId);
      await db.image.delete({ where: { id: organisation.image[0].id! } });
    }
    await db.organisation.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

export default router;
