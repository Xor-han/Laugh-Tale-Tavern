import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as characterController from "@/controller/character.controller";
const router: express.Router = express.Router();

router.get("/", characterController.getAll);
router.get("/id/:id", characterController.getById);
router.get("/:slug", characterController.getBySlug);
router.post("/", authMiddleware, adminMiddleware, characterController.create);
router.put("/id/:id", authMiddleware, adminMiddleware, characterController.update);
router.patch("/id/:id",authMiddleware,adminMiddleware,characterController.patch,);
router.delete("/id/:id",authMiddleware,adminMiddleware,characterController.remove,);

export default router;
