// index.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import fileRoutes from "./routes/files";
import chatRoutes from "./routes/chat.routes";

dotenv.config();

const app = express();

// 1) CONFIGURAR CORS PARA TODO ORIGEN
app.use(
  cors({
    origin: "*",                   // 🔥 Permite cualquier origen (global)
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"],
    credentials: true,
  })
);

// 2) RESPONDER PREFLIGHT PARA TODAS LAS RUTAS
app.options("*", cors());

// 3) MIDDLEWARES
app.use(express.json());

// 4) RUTAS
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);

// 5) RUTA NO ENCONTRADA
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// 6) MANEJO GLOBAL DE ERRORES
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

export default app;
