import { Request, Response } from "express";
import { verifyUser, createUser, getUserByMatricula } from "../models/User"; 
import { generateToken } from "../middlewares/authMiddleware";
import pool from "../config/db"; 

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
    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({ error: "Error en el servidor, intenta más tarde." });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matricula, nombre, correo, carrera, password } = req.body;

    if (!matricula || !nombre || !correo || !carrera || !password) {
      res.status(400).json({ error: "Todos los campos son requeridos." });
      return;
    }

    const userId = await createUser({ matricula, nombre, correo, carrera, password });
    res.status(201).json({ message: "Usuario registrado correctamente", userId });
  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

export const updateName = async (req: Request, res: Response): Promise<void> => {
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
      await pool.query("UPDATE usuarios SET nombre = ? WHERE matricula = ?", [nombre, matricula]);
      res.json({ message: "Nombre actualizado correctamente." });
    } else {
      res.json({ message: "El nombre ya estaba actualizado." });
    }
  } catch (error) {
    console.error("❌ Error en updateName:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

// ❌ ELIMINA ESTO (NO ES NECESARIO EXPORTAR OTRA VEZ)
// export { loginUser, registerUser, updateName };
