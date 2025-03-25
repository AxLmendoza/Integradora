/* src/controllers/uploadController.ts */

import { Request, Response } from "express";
import { subirArchivo } from "../utils/s3Upload";
import { saveFileMetadata } from "../models/archivoModel";

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No se recibió ningún archivo" });
      return;
    }

    const { titulo, descripcion } = req.body;
    const fileUrl = await subirArchivo(req.file);
    const fileId = await saveFileMetadata(titulo, descripcion, fileUrl);

    res.json({ message: "Archivo subido correctamente", fileId, fileUrl });
  } catch (error) {
    console.error("❌ Error al subir archivo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
