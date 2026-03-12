import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import db from "@/lib/db";
import { isAdmin } from "@/middleware/isAdmin";
import { fromNodeHeaders } from "better-auth/node";
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";

const router: express.Router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Seules les images sont autorisées"));
    }
  },
});
const getUserId = async (req: Request): Promise<string | null> => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
};
router.post(
  "/",
  isAdmin,
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      const userId = await getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Non authentifié" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "Aucune image fournie" });
      }
      const resultat = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `LaughTaleTavern`,
            transformation: [
              { width: 1920, crop: "limit" },
              { quality: "auto", fetch_format: "webp" },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Upload échoué"));
            } else {
              resolve({
                secure_url: result.secure_url,
                public_id: result.public_id,
              });
            }
          },
        );
        stream.end(req.file!.buffer);
      });

      const image = await db.image.create({
        data: {
          url: resultat.secure_url,
          publicId: resultat.public_id,
        },
      });

      res.status(201).json(image);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
);

router.delete("/:id", isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const { id } = req.params;

    const existing = await db.image.findUnique({ where: { id: String(id) } });
    if (!existing) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    await cloudinary.uploader.destroy(existing.publicId);
    await db.image.delete({ where: { id: String(id) } });

    res.status(204).send();
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ message: "Image not found" });
      return;
    }
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({ message: err.message });
    return;
  }
  if (err.message === "Seules les images sont autorisées") {
    res.status(400).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: "Erreur serveur" });
});

export default router;
