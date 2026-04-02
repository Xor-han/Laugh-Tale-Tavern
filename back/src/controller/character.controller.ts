import { Request, Response } from "express";
import {
  createCharacterShema,
  patchCharacterShema,
  updateCharacterShema,
} from "@/dtos/character.dto";
import * as characterService from "@/services/character.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.title === "string" ? req.query.title : undefined;
    const character = await characterService.getAllCharacter(search);
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const character = await characterService.getCharacterById(
     Number(req.params.id),
    );
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const getBySlug = async (req: Request, res: Response) => {
  try {
    const character = await characterService.getCharacterBySlug(
     String(req.params.slug),
    );
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const parsed = createCharacterShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const character = await characterService.createCharacter(parsed.data);
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const parsed = updateCharacterShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const character = await characterService.updateCharacter(
      Number(req.params.id),
      parsed.data,
    );
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const patch = async (req: Request, res: Response) => {
  try {
    const parsed = patchCharacterShema.safeParse(req.body);
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
    const character = await characterService.patchCharacter(
      Number(req.params.id),
      parsed.data,
    );
    if (!character) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await characterService.deleteCharacter(Number(req.params.id))
    if(!result){
        return res.status(404).json({message: "Character not found"})
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
