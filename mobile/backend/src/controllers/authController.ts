/* src/controllers/authController.ts */

import { Request, Response } from "express";
import { verifyUser, createUser, getUserByMatricula } from "../models/User";
import { generateToken } from "../middlewares/authMiddleware";
import pool from "../config/db";

/*===========================
  Inicio de sesion de Usuario
  ===========================*/
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matricula, password } = req.body;

    if (!matricula || !password) {
      res.status(400).json({ error: "Matrícula y contraseña requeridos" });
      return;
    }

    const usuario = await verifyUser(matricula, password);
    if (!usuario || !usuario.id) {
      res.status(400).json({ error: "Credenciales incorrectas" });
      return;
    }

    const token = generateToken(usuario.id);

    // Verificar si la matrícula es la del administrador
    const ADMIN_MATRICULA = process.env.ADMIN_MATRICULA || "202524"; // Ajusta según tu entorno
    const isAdmin = usuario.matricula === ADMIN_MATRICULA;

    console.log("🛠️ isAdmin:", isAdmin); // Agrega este log para verificar

    res.status(200).json({
      message: "Login exitoso",
      token,
      matricula: usuario.matricula,
      nombre: usuario.nombre,
      carrera: usuario.carrera,
      isAdmin, // ✅ Asegúrate de enviar esto correctamente
    });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ error: "Error en el servidor, intenta más tarde." });
  }
};

/*===================
  Registro de Usuario
  ===================*/

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { matricula, nombre, correo, carrera, password } = req.body;

    if (!matricula || !nombre || !correo || !carrera || !password) {
      res.status(400).json({ error: "Todos los campos son requeridos." });
      return;
    }

    const userId = await createUser({
      matricula,
      nombre,
      correo,
      carrera,
      password,
    });
    res
      .status(201)
      .json({ message: "Usuario registrado correctamente", userId });
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

export const updateName = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { matricula, nombre } = req.body;

    if (!matricula || !nombre) {
      res.status(400).json({ error: "Matrícula y nombre son requeridos." });
      return;
    }

    const user = await getUserByMatricula(matricula);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado." });
      return;
    }

    if (user.nombre !== nombre) {
      await pool.query("UPDATE usuarios SET nombre = ? WHERE matricula = ?", [
        nombre,
        matricula,
      ]);
      res.json({ message: "Nombre actualizado correctamente." });
    } else {
      res.json({ message: "El nombre ya estaba actualizado." });
    }
  } catch (error) {
    console.error("❌ Error en updateName:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};


