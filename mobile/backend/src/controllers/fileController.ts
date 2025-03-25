import { Request, Response } from "express";
import pool from "../config/db";
import { subirArchivoAS3 } from "../services/s3Service";
import multer from "multer";
import path from "path";

export const guardarArchivo = async (req: Request, res: Response) => {
  const { titulo, descripcion, fileUrl } = req.body;
  if (!titulo || !fileUrl) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }
  try {
    const [result]: any = await pool.query(
      "INSERT INTO archivos (titulo, descripcion, file_url) VALUES (?, ?, ?)",
      [titulo, descripcion, fileUrl]
    );
    res.status(201).json({ message: "Archivo guardado", id: result.insertId });
  } catch (error) {
    console.error("Error al guardar metadata:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const upload = multer({ dest: "uploads/" });
export const subirArchivo = [
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "No se recibió ningún archivo" });
      }
      const fileUrl = await subirArchivoAS3(file.path, file.originalname, file.mimetype);
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error("Error al subir archivo:", error);
      res.status(500).json({ error: "Error al subir archivo" });
    }
  },
];
