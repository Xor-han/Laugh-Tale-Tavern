import express, { Request, Response } from "express";
import db from "@/lib/db";
import { Faction, Profession } from "@prisma/client";

const router: express.Router = express.Router();

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

router.post("/", async (req : Request, res : Response) => {
    try {
        const {name, image, faction, profession, isAlive, devilFruit_id} = req.body

        const newCharacter = await db.onePieceCharacter.create({
            data : {
                name,
                image,
                faction,
                profession,
                isAlive : isAlive || false,
                devilFruit_id : devilFruit_id || null
            }
        })
         res.status(201).json(newCharacter);
         } catch (error) {
        res.status(500).json({message : "Error server", error});
    }
});

router.put("/", async (req : Request, res : Response) => {
    try {
        const {id} = req.params
        const {name, image, faction, profession, isAlive, devilFruit_id} = req.body;

        if(!name || !faction){
            return res.status(400).json({
                message : "Les champs name et faction sont obligatoires"
            });
        };

        const data = await db.onePieceCharacter.update({
            where : {id : Number(id)},
            data : {
                name,
                image,
                faction,
                devilFruit_id : devilFruit_id || null,
                profession,
                isAlive : isAlive ?? false
            }
        });

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({message : "Error server", error});
    }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {

    const { id } = req.params;

    const existing = await db.onePieceCharacter.findUnique({
        where : {
            id : Number(id)
        }
    });

    const { name, image, faction, devilFruit_id, profession, isAlive } = req.body;

    const data : {
        name? : string;
        image? : string;
        faction? : Faction;
        devilFruit_id? : number | null;
        profession? : Profession;
        isAlive? : boolean;
    } = {};

    if (name !== undefined){
        data.name = name
    }

    if (image !== undefined){
        data.image = image
    }

    if (faction !== undefined){
        data.faction = faction
    }

    if (devilFruit_id !== undefined){
        data.devilFruit_id = devilFruit_id
    }

    if (isAlive !== undefined){
        data.isAlive = isAlive
    }

    if (profession !== undefined){
        data.profession = profession
    }

    if (Object.keys(data).length === 0){
        return res.status(400).json({
            message : "Aucun champs à modifier"
        })
    }

    const character = await db.onePieceCharacter.update({
        where : {id : Number(id)},
        data
    });
    res.status(200).json(character);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

router.delete("/:id", async (req : Request, res : Response) => {
    try{

        const {id} = req.params;

        const existing = await db.onePieceCharacter.findUnique({
            where : {
                id : Number(id)
            }
        });

        await db.onePieceCharacter.delete({
            where : {id : Number(id)}
        })
        res.status(204).json("Personnage supprimé avec succès");
    } catch(error){
        res.status(500).json({message : "Error server", error});
    }
})

export default router