import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as crewController from "@/controller/crew.controller";
const router: express.Router = express.Router();

router.get("/", crewController.getAll);
router.get("/:slug", crewController.getById);
router.post("/", authMiddleware, adminMiddleware, crewController.create);
router.put("/:id", authMiddleware, adminMiddleware, crewController.update);
router.patch("/:id",authMiddleware,adminMiddleware,crewController.patch,);
router.delete("/:id",authMiddleware,adminMiddleware,crewController.remove,);

export default router;
