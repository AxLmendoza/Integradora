/* index.ts */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import fileRoutes from "./routes/files"; // Se agrega la nueva ruta


dotenv.config();

const router = express.Router();
const app = express();

app.use(cors({
  origin: ["http://localhost:8081", "http://192.168.0.101:8081"], // Añade todas las URLs posibles
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes); // Se mantiene la ruta de archivos

console.log("Rutas disponibles:");
const routes = app._router.stack
  .filter((middleware: any) => middleware.route)
  .map((middleware: any) => ({
    path: middleware.route.path,
    method: middleware.route.stack[0].method
  }));

console.log(routes)


export default app;