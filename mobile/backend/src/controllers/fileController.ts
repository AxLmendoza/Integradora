import { Request, Response } from "express";
import pool  from "../config/db";
import { subirArchivoAS3 } from "../services/s3Service";
import multer from "multer";

// Tipar la función guardarArchivo
export const guardarArchivo = async (req: Request, res: Response): Promise<Response> => {
    const { titulo, descripcion, fileUrl } = req.body;
    if (!titulo || !fileUrl) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }
  
    try {
      // Ejecutar la consulta
      const [result]: any = await pool.query(
        "INSERT INTO archivos (titulo, descripcion, file_url) VALUES (?, ?, ?)",
        [titulo, descripcion, fileUrl]
      );
  
      // Verificar si result tiene insertId
      if (result && result.insertId) {
        return res.status(201).json({ message: "Archivo guardado", id: result.insertId });
      } else {
        throw new Error("No se pudo obtener el ID del archivo insertado");
      }
    } catch (error) {
      console.error("Error al guardar metadata:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
  };

// Configuración de multer para recibir el archivo
const upload = multer({ dest: "uploads/" });

// Tipar la función subirArchivo
export const subirArchivo = [
    upload.single("file"),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const file = req.file as Express.Multer.File; // Usar Express.Multer.File para tipar el archivo
        if (!file) {
          res.status(400).json({ error: "No se recibió ningún archivo" });
          return; // Finaliza la ejecución después de enviar la respuesta
        }
  
        // Sube el archivo a S3
        const fileUrl = await subirArchivoAS3(file.path, file.originalname, file.mimetype);
  
        res.status(200).json({ fileUrl });
      } catch (error) {
        console.error("Error al subir archivo:", error);
        res.status(500).json({ error: "Error al subir archivo" });
      }
    },
  ];