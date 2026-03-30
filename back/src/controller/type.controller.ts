import { Request, Response } from "express";
import {
  createTypeShema,
  updateTypeShema
} from "@/dtos/type.dto";
import * as typeService from "@/services/type.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.title === "string" ? req.query.title : undefined;
    const types = await typeService.getAllType(search);
    res.json(types);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const type = await typeService.getTypeById(
      Number(req.params.id),
    );
    if (!type) {
      return res.status(400).json({ message: "Type not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const parsed = createTypeShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const type = await typeService.createType(parsed.data);
    res.status(201).json(type);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const parsed = updateTypeShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const type = await typeService.updateType(
      Number(req.params.id),
      parsed.data,
    );
    if (!type) {
      return res.status(404).json({ message: "Type not found" });
    }
    res.json(type);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await typeService.deleteType(Number(req.params.id))
    if(!result){
        return res.status(404).json({message: "Type not found"})
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
