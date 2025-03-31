import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import fileRoutes from "./routes/files"; // Se agrega la nueva ruta

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes); // Se mantiene la ruta de archivos

export default app;
