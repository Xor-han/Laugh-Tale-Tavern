import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as organisationController from "@/controller/organisation.controller";
const router: express.Router = express.Router();

router.get("/", organisationController.getAll);
router.get("/id/:id", organisationController.getById);
router.get("/:slug", organisationController.getBySlug);
router.post("/", authMiddleware, adminMiddleware, organisationController.create);
router.put("/id/:id", authMiddleware, adminMiddleware, organisationController.update);
router.patch("/id/:id",authMiddleware,adminMiddleware,organisationController.patch,);
router.delete("/id/:id",authMiddleware,adminMiddleware,organisationController.remove,);

export default router;
