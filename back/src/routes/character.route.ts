import express, { Request, Response } from "express";
import db from "@/lib/db";
import { Profession } from "@prisma/client";
import { auth } from "@/lib/auth";
import { fromNodeHeaders } from "better-auth/node";

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

router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const {
      name,
      image,
      profession,
      isAlive,
      devilFruit_id,
      organisationId,
      equipageId,
    } = req.body;

    const newCharacter = await db.onePieceCharacter.create({
      data: {
        name,
        image,
        profession,
        isAlive: isAlive || false,
        devilFruit_id: devilFruit_id || null,
        organisationId: organisationId || null,
        equipageId: equipageId || null,
      },
    });
    res.status(201).json(newCharacter);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});

router.put("/", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;
    const {
      name,
      image,
      profession,
      isAlive,
      devilFruit_id,
      organisationId,
      equipageId,
    } = req.body;

    if (!name || !image || !profession) {
      return res.status(400).json({
        message: "Les champs name, image et profession sont obligatoires",
      });
    }

    const data = await db.onePieceCharacter.update({
      where: { id: Number(id) },
      data: {
        name,
        image,
        devilFruit_id: devilFruit_id || null,
        profession,
        isAlive: isAlive ?? false,
        organisationId: organisationId || null,
        equipageId: equipageId || null,
      },
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;

    const existing = await db.onePieceCharacter.findUnique({
      where: {
        id: Number(id),
      },
    });

    const {
      name,
      image,
      devilFruit_id,
      profession,
      isAlive,
      organisationId,
      equipageId,
    } = req.body;

    const data: {
      name?: string;
      image?: string;
      devilFruit_id?: number | null;
      profession?: Profession;
      isAlive?: boolean;
      organisationId?: number | null;
      equipageId?: number | null;
    } = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (image !== undefined) {
      data.image = image;
    }

    if (devilFruit_id !== undefined) {
      data.devilFruit_id = devilFruit_id;
    }

    if (isAlive !== undefined) {
      data.isAlive = isAlive;
    }

    if (profession !== undefined) {
      data.profession = profession;
    }
    if (organisationId !== undefined) {
      data.organisationId = organisationId;
    }
    if (equipageId !== undefined) {
      data.equipageId = equipageId;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "Aucun champs à modifier",
      });
    }

    const character = await db.onePieceCharacter.update({
      where: { id: Number(id) },
      data,
    });
    res.status(200).json(character);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const { id } = req.params;

    const existing = await db.onePieceCharacter.findUnique({
      where: {
        id: Number(id),
      },
    });

    await db.onePieceCharacter.delete({
      where: { id: Number(id) },
    });
    res.status(204).json("Personnage supprimé avec succès");
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
});

export default router;
