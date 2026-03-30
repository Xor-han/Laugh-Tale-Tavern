import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as typeController from "@/controller/type.controller";
const router: express.Router = express.Router();

router.get("/", typeController.getAll);
router.get("/:id", typeController.getById);
router.post("/", authMiddleware, adminMiddleware, typeController.create);
router.put("/:id", authMiddleware, adminMiddleware, typeController.update);
router.delete("/:id",authMiddleware,adminMiddleware,typeController.remove,);

export default router;
