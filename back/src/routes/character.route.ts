import express, { Request, Response } from "express";
import db from "@/lib/db";
import { Profession } from "@prisma/client";
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
    const data = await db.onePieceCharacter.findMany({
      orderBy: { name: "desc" },
      include: {
        devilFruit: {
          select: {
            name: true,
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
    const { id } = req.params;
    const data = await db.onePieceCharacter.findUnique({
      where: { id: Number(id) },
      include: { devilFruit: { select: { name: true } } },
    });
    if (!data) {
      return res.status(404).json({ message: "Personnage non trouvé" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});

router.post("/", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    const {
      name,
      image,
      isAlive,
      devilFruit_id,
      organisationId,
      equipageId,
      profession,
      arcId,
    } = req.body;

    if (!name || !image || isAlive === undefined || !profession) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const newCharacter = await db.onePieceCharacter.create({
      data: {
        name,
        image,
        isAlive,
        profession,
        devilFruit_id: devilFruit_id ? Number(devilFruit_id) : null,
        organisationId: organisationId ? Number(organisationId) : null,
        equipageId: equipageId ? Number(equipageId) : null,
        arcId: arcId ? Number(arcId) : null,
      },
    });

    res.status(201).json(newCharacter);
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
    const {
      name,
      image,
      isAlive,
      profession,
      devilFruit_id,
      organisationId,
      equipageId,
      arcId,
    } = req.body;

    if (!name || !image || isAlive === undefined || !profession) {
      return res.status(400).json({
        message:
          "Les champs name, image, isAlive et profession sont obligatoires",
      });
    }

    const existing = await db.onePieceCharacter.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Personnage non trouvé" });
    }

    const updatedCharacter = await db.onePieceCharacter.update({
      where: { id: Number(id) },
      data: {
        name,
        image,
        isAlive: Boolean(isAlive),
        profession,
        devilFruit_id: devilFruit_id ? Number(devilFruit_id) : null,
        organisationId: organisationId ? Number(organisationId) : null,
        equipageId: equipageId ? Number(equipageId) : null,
        arcId: arcId ? Number(arcId) : null,
      },
    });

    res.status(200).json(updatedCharacter);
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


    const existing = await db.onePieceCharacter.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Personnage non trouvé" });
    }

    const {
      name,
      image,
      isAlive,
      profession,
      devilFruit_id,
      organisationId,
      equipageId,
      arcId,
    } = req.body;

    const data: {
      name?: string;
      image?: string;
      isAlive?: boolean;
      profession?: Profession;
      devilFruit_id?: number | null;
      organisationId?: number | null;
      equipageId?: number | null;
      arcId?: number | null;
    } = {};

    if (name !== undefined) data.name = name;
    if (image !== undefined) data.image = image;
    if (isAlive !== undefined) data.isAlive = isAlive;
    if (profession !== undefined) data.profession = profession;


    if (devilFruit_id !== undefined) {
      data.devilFruit_id =
        devilFruit_id !== null ? Number(devilFruit_id) : null;
    }
    if (organisationId !== undefined) {
      data.organisationId =
        organisationId !== null ? Number(organisationId) : null;
    }
    if (equipageId !== undefined) {
      data.equipageId = equipageId !== null ? Number(equipageId) : null;
    }
    if (arcId !== undefined) {
      data.arcId = arcId !== null ? Number(arcId) : null;
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
    console.error("Erreur PATCH Character:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) return res.status(401).json({ message: "Non authentifié" });

    await db.onePieceCharacter.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erreur de suppression" });
  }
});

export default router;
