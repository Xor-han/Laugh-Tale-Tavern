import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth"; // Ton instance Better Auth

export interface AuthRequest extends Request {
  session?: any;
}

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  const user = session?.user as { role?: string } | undefined;
  if (!session || user?.role !== "admin") {
    return res.status(403).json({ error: "Accès interdit" });
  }

  req.session = session;
  next();
};
