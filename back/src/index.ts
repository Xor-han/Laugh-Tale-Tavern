import app from "@/app"
import db from "@/lib/db";

const PORT = process.env.PORT || 3000;

// ========== DÉMARRAGE DU SERVEUR ==========
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await db.$connect();
    console.log("Databe connected successfull");
  } catch (error) {
    console.log("Database connection failed:", error);
  }
});
