import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as arcController from "@/controller/arc.controller";
const router: express.Router = express.Router();

router.get("/", arcController.getAll);
router.get("/:slug", arcController.getById);
router.post("/", arcController.create);
router.put("/:id", authMiddleware, adminMiddleware, arcController.update);
router.patch("/:id",authMiddleware,adminMiddleware,arcController.patch,);
router.delete("/:id",authMiddleware,adminMiddleware,arcController.remove,);

export default router;
