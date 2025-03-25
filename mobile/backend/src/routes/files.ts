/* src/routes/files.ts */

import express from "express";
import multer from "multer";
import { subirArchivo } from "../utils/s3Upload";
import { saveFileMetadata } from "../models/archivoModel";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/subir", upload.single("archivo"), (req, res, next) => {
  (async () => {
    try {
      if (!req.file) return res.status(400).json({ error: "No se envió ningún archivo" });

      const { titulo, descripcion } = req.body;
      const fileUrl = await subirArchivo(req.file);
      const fileId = await saveFileMetadata(titulo, descripcion, fileUrl);

      res.json({ message: "Archivo subido correctamente", fileId, fileUrl });
    } catch (error) {
      console.error("❌ Error al subir archivo:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  })().catch(next);
});

export default router;