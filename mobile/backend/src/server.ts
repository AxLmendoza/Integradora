// server.ts
import app from "./index";
import dotenv from "dotenv";
dotenv.config();

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

app
  .listen(PORT, HOST, () => {
    console.log(`✅ Servidor corriendo en http://${HOST}:${PORT}`);
  })
  .on("error", (err: Error) => {
    console.error("❌ Error al iniciar el servidor:", err);
  });
