import { Request, Response } from "express";
import {
  createArcShema,
  patchArcShema,
  updateArcShema,
} from "@/dtos/arc.dto";
import * as arcService from "@/services/arc.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.title === "string" ? req.query.title : undefined;
    const arcs = await arcService.getAllArc(search);
    res.json(arcs);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const arc = await arcService.getArcById(
      Number(req.params.id),
    );
    if (!arc) {
      return res.status(404).json({ message: "Arc not found" });
    }
    res.json(arc);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const arc = await arcService.getArcBySlug(
      String(req.params.slug),
    );
    if (!arc) {
      return res.status(404).json({ message: "Arc not found" });
    }
    res.json(arc);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const parsed = createArcShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const arc = await arcService.createArc(parsed.data);
    res.status(201).json(arc);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const parsed = updateArcShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const arc = await arcService.updateArc(
      Number(req.params.id),
      parsed.data,
    );
    if (!arc) {
      return res.status(404).json({ message: "Arc not found" });
    }
    res.json(arc);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const patch = async (req: Request, res: Response) => {
  try {
    const parsed = patchArcShema.safeParse(req.body);
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
    const arc = await arcService.PatchArc(
      Number(req.params.id),
      parsed.data,
    );
    if (!arc) {
      return res.status(404).json({ message: "Arc not found" });
    }
    res.json(arc);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await arcService.deleteArc(Number(req.params.id))
    if(!result){
        return res.status(404).json({message: "Arc not found"})
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
