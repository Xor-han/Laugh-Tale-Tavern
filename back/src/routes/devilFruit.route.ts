import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as devilFruitController from "@/controller/devilFruit.controller";
const router: express.Router = express.Router();

router.get("/", devilFruitController.getAll);
router.get("/:slug", devilFruitController.getById);
router.post("/", authMiddleware, adminMiddleware, devilFruitController.create);
router.put("/:id", authMiddleware, adminMiddleware, devilFruitController.update);
router.patch("/:id",authMiddleware,adminMiddleware,devilFruitController.patch,);
router.delete("/:id",authMiddleware,adminMiddleware,devilFruitController.remove,);

export default router;
