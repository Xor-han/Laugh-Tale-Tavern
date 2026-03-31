import express from "express";
import * as articleController from "@/controller/article.controller";

const router: express.Router = express.Router();

router.get("/", articleController.getAll);

export default router;
