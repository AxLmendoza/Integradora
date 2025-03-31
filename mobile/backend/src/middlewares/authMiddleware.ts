/* src/middlewares/authController.ts */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId: number): string => {
  return jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
};


const SECRET_KEY = process.env.JWT_SECRET as string;
if (!SECRET_KEY) {
  throw new Error("Falta la variable de entorno JWT_SECRET");
}

export const verificarToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(403).json({ error: "Token requerido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
    req.body.usuario_id = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};