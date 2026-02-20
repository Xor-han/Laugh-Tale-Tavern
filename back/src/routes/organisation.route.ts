import express, { Request, Response } from "express";
import db from "@/lib/db";
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
    const data = await db.organisation.findMany({
      include: {
        _count: { select: { onePieceCharacter: true } },
        equipage: true
      }
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});


export default router;