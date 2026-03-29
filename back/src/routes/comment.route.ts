import express from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as commentController from "@/controller/comment.controller";
const router: express.Router = express.Router();

router.get("/", commentController.getAll);
router.get("/:id",commentController.getById);
router.post("/", authMiddleware, commentController.create);
router.put("/:id", authMiddleware,commentController.update);
router.delete("/:id",authMiddleware,commentController.remove,);

export default router;
