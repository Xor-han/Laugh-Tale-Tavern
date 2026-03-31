import { Request, Response } from "express";
import {
  createDevilFruitShema,
  patchDevilFruitShema,
  updateDevilFruitShema,
} from "@/dtos/devilFruit.dto";
import * as devilFruitService from "@/services/devilFruit.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.title === "string" ? req.query.title : undefined;
    const devilFruits = await devilFruitService.getAllDevilFruit(search);
    res.json(devilFruits);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const devilFruit = await devilFruitService.getDevilFruitById(
      String(req.params.slug),
    );
    if (!devilFruit) {
      return res.status(404).json({ message: "Devil Fruit not found" });
    }
    res.json(devilFruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const parsed = createDevilFruitShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const devilFruit = await devilFruitService.createDevilFruit(parsed.data);
    res.status(201).json(devilFruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const parsed = updateDevilFruitShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const devilFruit = await devilFruitService.updateDevilFruit(
      Number(req.params.id),
      parsed.data,
    );
    if (!devilFruit) {
      return res.status(404).json({ message: "Devil Fruit not found" });
    }
    res.json(devilFruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const patch = async (req: Request, res: Response) => {
  try {
    const parsed = patchDevilFruitShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    if (Object.keys(parsed.data).length === 0) {
      return res.status(400).json({
        message: "Aucun champs à modifier",
      });
    }
    const devilFruit = await devilFruitService.PatchDevilFruit(
      Number(req.params.id),
      parsed.data,
    );
    if (devilFruit) {
      return res.status(404).json({ message: "Devil Fruit not found" });
    }
    res.json(devilFruit);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await devilFruitService.deleteDevilFruit(Number(req.params.id))
    if(!result){
        return res.status(404).json({message: "Devil Fruit not found"})
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
