import { Request, Response } from "express";
import { getArticlesQuerySchema } from "@/dtos/article.dto";
import * as articleService from "@/services/article.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const parsed = getArticlesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Paramètres invalides", errors: parsed.error.issues });
    }
    const articles = await articleService.getAllArticles(parsed.data);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: "Erreur server", error });
  }
};
