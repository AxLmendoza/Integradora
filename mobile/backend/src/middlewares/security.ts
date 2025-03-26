/* src/middlewares/security.ts */

import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const securityMiddleware = (app: any) => {
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Máximo 100 peticiones por IP
      message: "Demasiadas peticiones, por favor intenta más tarde.",
    })
  );
};
