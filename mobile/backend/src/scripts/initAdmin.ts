import dotenv from "dotenv";
import pool from "../config/db"
import bcrypt from "bcrypt";

dotenv.config();

const crearAdmin = async () => {
  try {
    console.log("🔹 Conectando a la base de datos...");

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const adminPassword = process.env.ADMIN_PASSWORD ?? "defaultPassword123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await connection.execute(
      `INSERT IGNORE INTO usuarios (matricula, nombre, password, correo, carrera) VALUES (?, ?, ?, ?, ?)`,
      ["ADMIN002", "Administrador", hashedPassword, process.env.ADMIN_EMAIL, "Administración"]
    );
    

    const [rows]: any = await connection.execute(
      `INSERT IGNORE INTO usuarios (matricula, nombre, password, correo, carrera) VALUES (?, ?, ?, ?, ?)`,
      ["ADMIN002", "Administrador", hashedPassword, process.env.ADMIN_EMAIL, "Administración"]
    );
    
    if (rows.affectedRows > 0) {
      console.log("✅ Usuario administrador creado exitosamente.");
    } else {
      console.log("⚠️ Usuario administrador ya existe.");
    }

    await connection.commit();
    connection.release();
  } catch (error) {
    if ((error as any).code === 'ER_DUP_ENTRY') {
      console.log("⚠️ El usuario administrador ya existe.");
    } else {
      console.error("❌ Error inesperado al crear el usuario administrador:", error);
    }
  }
};

crearAdmin();
