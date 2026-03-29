import { Request, Response } from "express";
import {
  createCrewShema,
  patchCrewShema,
  updateCrewShema,
} from "@/dtos/crew.dto";
import * as crewService from "@/services/crew.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.title === "string" ? req.query.title : undefined;
    const crews = await crewService.getAllCrew(search);
    res.json(crews);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const crew = await crewService.getCrewById(
      Number(req.params.id),
    );
    if (!crew) {
      return res.status(400).json({ message: "Crew not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const parsed = createCrewShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const crew = await crewService.createCrew(parsed.data);
    res.status(201).json(crew);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const parsed = updateCrewShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const crew = await crewService.updateCrew(
      Number(req.params.id),
      parsed.data,
    );
    if (!crew) {
      return res.status(404).json({ message: "Crew not found" });
    }
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const patch = async (req: Request, res: Response) => {
  try {
    const parsed = patchCrewShema.safeParse(req.body);
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
    const crew = await crewService.PatchCrew(
      Number(req.params.id),
      parsed.data,
    );
    if (!crew) {
      return res.status(404).json({ message: "Crew not found" });
    }
    res.json(crew);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await crewService.deleteCrew(Number(req.params.id))
    if(!result){
        return res.status(404).json({message: "Crew not found"})
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
