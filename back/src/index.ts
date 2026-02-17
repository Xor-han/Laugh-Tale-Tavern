import express, {Request, Response} from 'express';
import cors from "cors";
import db from '@/lib/db';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '@/lib/auth';
import characterRouter from "@/routes/character.route"
import commentRouter from "@/routes/comment.route"

const app = express();
const port = 3000;

app.use(cors({
    origin : "Front_URL",
    credentials: true
}));

app.all("/api/auth/{*splat}", toNodeHandler(auth))
app.use(express.json());

app.get("/", (req : Request, res : Response) => {
    res.json({
        message : "Bienvenue sur l'API de La Taverne de Laugh Tale"
    });
});


app.use("/character", characterRouter);
app.use("/comment", commentRouter);


// ========== DÉMARRAGE DU SERVEUR ==========
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    try{
        await db.$connect();
        console.log("Databe connected successfull")
    } catch(error){
        console.log("Database connection failed:", error)
    }
});