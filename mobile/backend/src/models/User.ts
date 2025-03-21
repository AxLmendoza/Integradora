import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import bcrypt from "bcrypt";

export interface Usuario {
  id?: number;
  matricula: string;
  nombre: string;
  password: string;
  correo: string;
  carrera: string;
}

export const getUserByMatricula = async (matricula: string): Promise<Usuario | null> => {
  try {
    const [rows]: [RowDataPacket[], any] = await pool.query(
      "SELECT * FROM usuarios WHERE matricula = ?",
      [matricula]
    );
    return rows.length ? (rows[0] as Usuario) : null;
  } catch (error) {
    console.error("❌ Error en getUserByMatricula:", error);
    throw new Error("Error al buscar usuario.");
  }
};

export const createUser = async (user: Usuario): Promise<number> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const [result]: any = await pool.query(
      "INSERT INTO usuarios (matricula, nombre, password, correo, carrera) VALUES (?, ?, ?, ?, ?)",
      [user.matricula, user.nombre, hashedPassword, user.correo, user.carrera]
    );
    return result.insertId;
  } catch (error) {
    console.error("❌ Error en createUser:", error);
    throw new Error("Error al crear usuario.");
  }
};

export const verifyUser = async (matricula: string, password: string): Promise<Usuario | null> => {
  try {
    const user = await getUserByMatricula(matricula);

    if (!user) {
      console.log("❌ Usuario no encontrado en la BD.");
      return null;
    }

    console.log("🔍 Usuario encontrado:", user);

    console.log("🔑 Password almacenado en BD:", user.password);
    console.log("🔑 Password ingresado:", password);

    const match = await bcrypt.compare(password, user.password);
    console.log("✅ ¿Coincide la contraseña?:", match);

    return match ? user : null;
  } catch (error) {
    console.error("❌ Error en verifyUser:", error);
    throw new Error("Error al verificar usuario.");
  }
};

