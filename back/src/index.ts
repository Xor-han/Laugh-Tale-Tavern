import app from "@/app"
import db from "@/lib/db";

const port = 3000;

// ========== DÉMARRAGE DU SERVEUR ==========
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  try {
    await db.$connect();
    console.log("Databe connected successfull");
  } catch (error) {
    console.log("Database connection failed:", error);
  }
});
