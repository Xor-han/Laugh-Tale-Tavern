import { Request, Response } from "express";
import * as imageService from "@/services/image.service";


export const getAll = async (req: Request, res: Response) => {
    try {
        const images = await imageService.getAllImages();
        res.json(images);
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    };
};


export async function upload(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Aucune image fournie" });
      return;
    }
    const image = await imageService.uploadImage(req.file.buffer);
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
}

export const remove = async (req : Request, res : Response) => {
    try {
        const result = await imageService.deleteImage(Number(req.params.id))
        if(!result){
           return res.status(404).json({message : "Image not found"}); 
        }
        res.status(204).send()
    } catch (error) {
        res.status(500).json({message : "Erreur server", error});
    }
}