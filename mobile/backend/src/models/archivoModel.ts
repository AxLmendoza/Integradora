/* src/models/archivoModel.ts */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

interface FileUrl {
  Location: string;
}

export async function saveFileMetadata(titulo: string, descripcion: string, fileUrl: string | FileUrl): Promise<number> {
  try {
    console.log("📌 URL recibida:", fileUrl);

    const urlLimpia = (fileUrl as FileUrl)?.Location ?? String(fileUrl);

    console.log("📝 Insertando en BD:", titulo, descripcion, urlLimpia);

    const [result]: any = await pool.query(
      "INSERT INTO archivos (titulo, descripcion, url) VALUES (?, ?, ?)",
      [titulo, descripcion, urlLimpia]
    );
    return result.insertId;
  } catch (error) {
    console.error("❌ Error al guardar metadatos del archivo:", error);
    throw error;
  }
}
