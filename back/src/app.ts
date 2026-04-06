import express, {type Express, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth";
import characterRouter from "@/routes/character.route";
import commentRouter from "@/routes/comment.route";
import devilFruitRouter from "@/routes/devilFruit.route";
import organisationRouter from "@/routes/organisation.route";
import equipageRouter from "@/routes/crew.route";
import typeRouter from "@/routes/type.route";
import arcRouter from "@/routes/arc.route";
import imageRouter from "@/routes/image.route";
import articleRouter from "@/routes/article.route";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.all("/api/auth/{*splat}", toNodeHandler(auth));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Bienvenue sur l'API de La Taverne de Laugh Tale",
  });
});

app.use("/characters", characterRouter);
app.use("/comments", commentRouter);
app.use("/devilFruits", devilFruitRouter);
app.use("/organisations", organisationRouter);
app.use("/crews", equipageRouter);
app.use("/types", typeRouter);
app.use("/arcs", arcRouter);
app.use("/images", imageRouter);
app.use("/articles", articleRouter);

export default app;

