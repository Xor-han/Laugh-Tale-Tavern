import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as characterController from "@/controller/character.controller";
const router: express.Router = express.Router();

router.get("/", characterController.getAll);
router.get("/:id", characterController.getById);
router.post("/", authMiddleware, adminMiddleware, characterController.create);
router.put("/:id", authMiddleware, adminMiddleware, characterController.update);
router.patch("/:id",authMiddleware,adminMiddleware,characterController.patch,);
router.delete("/:id",authMiddleware,adminMiddleware,characterController.remove,);

export default router;
