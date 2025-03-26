/* src/models/User.ts (Actualización para usar passwordUtils) */

import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { hashPassword, comparePassword } from "../utils/passwordUtils";

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
      "SELECT id, matricula, nombre, carrera, password FROM usuarios WHERE matricula = ?",
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
    const hashedPassword = await hashPassword(user.password);
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
    const [rows]: [RowDataPacket[], any] = await pool.query(
      "SELECT id, matricula, nombre, carrera, password FROM usuarios WHERE matricula = ?",
      [matricula]
    );
    
    if (!rows.length) return null;
    const user = rows[0] as Usuario;
    const match = await comparePassword(password, user.password);
    return match ? user : null;
  } catch (error) {
    console.error("❌ Error en verifyUser:", error);
    throw new Error("Error al verificar usuario.");
  }
};
