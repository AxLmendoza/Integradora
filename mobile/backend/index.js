import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

// Habilitar CORS para desarrollo: permite cualquier origen
app.use(cors({
    origin: "*", // Permite todas las solicitudes (para desarrollo)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// Monta las rutas de autenticación
app.use("/api/auth", authRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://192.168.1.103:${PORT}`);
});
