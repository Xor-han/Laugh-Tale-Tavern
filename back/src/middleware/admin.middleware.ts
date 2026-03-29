import { Request, Response, NextFunction } from "express";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.userRole !== "admin") {
    res.status(403).json({ error: "Accès interdit" });
    return;
  }

  next();
};