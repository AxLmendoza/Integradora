// routes/chat.routes.ts
import { Router, Request, Response } from "express";
import Pusher from "pusher";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

// Configurar Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "us2",
  useTLS: true,
});

// Endpoint para enviar mensaje
router.post("/message", async (req: Request, res: Response) => {
  const { username, message } = req.body;
  if (!username || !message) {
    return res.status(400).json({ error: "Faltan username o message" });
  }

  try {
    await pusher.trigger("chat", "new-message", {
      username,
      message,
      timestamp: new Date().toISOString(),
    });
    console.log(`📩 ${username}: ${message}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error al enviar mensaje:", error);
    return res.status(500).json({ success: false, error: "Error interno" });
  }
});

export default router;
