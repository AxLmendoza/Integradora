import app from "./index";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 3001; // 🔹 Convertimos PORT a número
const HOST = "0.0.0.0"; // 🔹 Permite conexiones en toda la red

app.listen(PORT, HOST, () => {
  console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
}).on("error", (err: Error) => {
  console.error("❌ Error al iniciar el servidor:", err);
});
