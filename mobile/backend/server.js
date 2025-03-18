import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

// Permitir cualquier origen para desarrollo (o restringirlo a "http://localhost:8082")
app.use(cors({
    origin: "*",  // Temporalmente permitir cualquier origen
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Manejar manualmente las solicitudes OPTIONS (preflight)
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
});

app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://192.168.1.103:${PORT}`);
});
