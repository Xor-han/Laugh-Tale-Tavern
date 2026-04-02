import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as crewController from "@/controller/crew.controller";
const router: express.Router = express.Router();

router.get("/", crewController.getAll);
router.get("/id/:id", crewController.getById);
router.get("/:slug", crewController.getBySlug);
router.post("/", authMiddleware, adminMiddleware, crewController.create);
router.put("/id/:id", authMiddleware, adminMiddleware, crewController.update);
router.patch("/id/:id",authMiddleware,adminMiddleware,crewController.patch,);
router.delete("/id/:id",authMiddleware,adminMiddleware,crewController.remove,);

export default router;
