import { Request, Response } from "express";
import {
  createOrganisationShema,
  patchOrganisationShema,
  updateOrganisationShema,
} from "@/dtos/organisation.dto";
import * as organisationService from "@/services/organisation.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.title === "string" ? req.query.title : undefined;
    const organisations = await organisationService.getAllOrganisation(search);
    res.json(organisations);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const organisation = await organisationService.getOrganisationById(
      Number(req.params.id),
    );
    if (!organisation) {
      return res.status(400).json({ message: "Organisation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const parsed = createOrganisationShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const organisation = await organisationService.createOrganisation(parsed.data);
    res.status(201).json(organisation);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const parsed = updateOrganisationShema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Données invalides", errors: parsed.error.issues });
    }
    const organisation = await organisationService.updateOrganisation(
      Number(req.params.id),
      parsed.data,
    );
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    res.json(organisation);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const patch = async (req: Request, res: Response) => {
  try {
    const parsed = patchOrganisationShema.safeParse(req.body);
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
    const organisation = await organisationService.PatchOrganisation(
      Number(req.params.id),
      parsed.data,
    );
    if (!organisation) {
      return res.status(404).json({ message: "Organisation not found" });
    }
    res.json(organisation);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await organisationService.deleteOrganisation(Number(req.params.id))
    if(!result){
        return res.status(404).json({message: "Organisation not found"})
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
