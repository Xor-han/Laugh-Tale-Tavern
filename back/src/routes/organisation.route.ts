import express from "express";
import { adminMiddleware } from "@/middleware/admin.middleware";
import { authMiddleware } from "@/middleware/auth.middleware";
import * as organisationController from "@/controller/organisation.controller";
const router: express.Router = express.Router();

router.get("/", organisationController.getAll);
router.get("/:id", organisationController.getById);
router.post("/", authMiddleware, adminMiddleware, organisationController.create);
router.put("/:id", authMiddleware, adminMiddleware, organisationController.update);
router.patch("/:id",authMiddleware,adminMiddleware,organisationController.patch,);
router.delete("/:id",authMiddleware,adminMiddleware,organisationController.remove,);

export default router;
