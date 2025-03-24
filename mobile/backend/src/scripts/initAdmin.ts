import dotenv from "dotenv";
import pool from "../config/db";
import bcrypt from "bcrypt";

dotenv.config();

const crearAdmin = async () => {
  try {
    console.log("🔹 Conectando a la base de datos...");
    const connection = await pool.getConnection();
    
    if (!connection) {
      console.log("❌ Error en la conexión a la base de datos");
      return;
    }

    await connection.beginTransaction();

    // 🟢 Usamos EXPO_PUBLIC_ADMIN_MATRICULA correctamente
    const adminMatricula = process.env.EXPO_PUBLIC_ADMIN_MATRICULA;
    if (!adminMatricula) {
      console.log("❌ ADMIN_MATRICULA no está definido en el archivo .env");
      connection.release();
      return;
    }

    // Verificar si el usuario ya existe antes de insertarlo
    const [existingUser]: any = await connection.execute(
      `SELECT matricula FROM usuarios WHERE matricula = ?`,
      [adminMatricula]
    );

    if (existingUser.length > 0) {
      console.log("⚠️ El usuario administrador ya existe.");
      connection.release();
      return;
    }

    // Hash de la contraseña
    const adminPassword = process.env.ADMIN_PASSWORD ?? "defaultPassword123";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Validar que ADMIN_EMAIL esté definido
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.log("❌ ADMIN_EMAIL no está definido en el archivo .env");
      connection.release();
      return;
    }

    // Insertar usuario administrador
    const [result]: any = await connection.execute(
      `INSERT INTO usuarios (matricula, nombre, password, correo, carrera) VALUES (?, ?, ?, ?, ?)`,
      [adminMatricula, "David Arenas Hernandez", hashedPassword, adminEmail, "Administración"]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Usuario administrador creado exitosamente.");
      await connection.commit();
    } else {
      console.log("⚠️ No se pudo crear el usuario administrador.");
      await connection.rollback();
    }

    connection.release();
  } catch (error: any) {
    console.error("❌ Error inesperado:", error);

    if (error.code === 'ER_DUP_ENTRY') {
      console.log("⚠️ El usuario administrador ya existe.");
    }

    if (error.sql) {
      console.log("📌 Error SQL:", error.sqlMessage);
    }
  }
};

// Ejecutar la función
crearAdmin();
