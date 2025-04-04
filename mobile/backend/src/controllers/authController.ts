/* src/controllers/authController.ts */
import { Request, Response } from "express";
import { verifyUser, createUser, getUserByMatricula } from "../models/User";
import { generateToken } from "../middlewares/authMiddleware";
import pool from "../config/db";
import { sendEmail } from "../utils/email";
import crypto from "crypto";
import { saveVerificationCode } from "../models/User"; // Asegúrate de que la ruta es correcta
import { hashPassword } from "../utils/passwordUtils"; // Asegúrate de importar la función de hashing
import { saveResetToken } from "../models/User"; // Asegúrate de que la ruta es correcta

// Define explícitamente que el controlador puede devolver un Response o void
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  console.log("Datos recibidos:", req.body);
  const { correo, otp } = req.body;

  if (!correo || !otp) {
    res.status(400).json({ error: "Correo y código OTP son obligatorios." });
    return;
  }

  try {
    const [results]: any = await pool.query(
      "SELECT * FROM usuarios_temp WHERE correo = ?",
      [correo]
    );

    console.log("🔍 Resultados de la consulta:", results);

    if (results.length === 0) {
      res.status(404).json({ error: "Usuario no encontrado o ya verificado." });
      return;
    }

    const { otp: storedOTP, otp_expires, matricula, nombre, carrera, password } = results[0];

    if (storedOTP !== otp) {
      res.status(400).json({ error: "Código OTP incorrecto." });
      return;
    }

    if (new Date() > new Date(otp_expires)) {
      res.status(400).json({ error: "Código OTP expirado." });
      return;
    }

    // ✅ Mover usuario de usuarios_temp a usuarios
    await pool.query(
      "INSERT INTO usuarios (matricula, nombre, correo, carrera, password) VALUES (?, ?, ?, ?, ?)",
      [matricula, nombre, correo, carrera, password] // La contraseña ya está hasheada
    );
    
    // ✅ Eliminar el usuario de usuarios_temp
    await pool.query("DELETE FROM usuarios_temp WHERE correo = ?", [correo]);

    res.status(200).json({ message: "Cuenta verificada correctamente. Ahora puedes iniciar sesión." });
  } catch (error) {
    console.error("❌ Error en verifyOTP:", error);
    res.status(500).json({ error: "Error al verificar el código OTP." });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const [rows]: any = await pool.query(
      "SELECT correo FROM usuarios WHERE otp = ? AND otp_expires > NOW()",
      [token]
    );

    if (!rows.length) {
      res.status(400).json({ error: "Token inválido o expirado." });
      return;
    }

    const email = rows[0].correo;
    const hashedPassword = await hashPassword(newPassword);

    await pool.query(
      "UPDATE usuarios SET password = ?, otp = NULL, otp_expires = NULL WHERE correo = ?",
      [hashedPassword, email]
    );

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  const verificationCode = crypto.randomInt(100000, 999999); // Código de 6 dígitos

  // Guarda el código en la base de datos con un tiempo de expiración
  await saveVerificationCode(email, verificationCode);

  // Enviar correo
  await sendEmail(
    email,
    "Código de verificación",
    `<p>Tu código es: <strong>${verificationCode}</strong></p>`
  );

  res.json({ message: "Código enviado" });
};

export const sendPasswordReset = async (req: Request, res: Response) => {
  const { correo } = req.body;
  const token = crypto.randomBytes(32).toString("hex");

  // Guarda el token en la base de datos con expiración
  await saveResetToken(correo, token);

  // Enviar correo con enlace de recuperación
  const resetLink = `https://192.168.0.101:3001/reset-password?token=${token}`;
  await sendEmail(
    correo,
    "Restablecer contraseña",
    `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer</a></p>`
  );

  res.json({ message: "Email de recuperación enviado" });
};

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
  
      // Verificar que el usuario está en la tabla "usuarios" (ya verificado)
      const usuario = await verifyUser(matricula, password);
      if (!usuario || !usuario.id) {
        res.status(400).json({ error: "Credenciales incorrectas o usuario no verificado." });
        return;
      }
  
      const token = generateToken(usuario.id);
  
      res.status(200).json({
        message: "Login exitoso",
        token,
        matricula: usuario.matricula,
        nombre: usuario.nombre,
        carrera: usuario.carrera,
      });
    } catch (error) {
      console.error("❌ Error en loginUser:", error);
      res.status(500).json({ error: "Error en el servidor, intenta más tarde." });
    }
  };
  
/*===================
  Registro de Usuario
  ===================*/

  export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { matricula, nombre, correo, carrera, password } = req.body;
  
      if (!matricula || !nombre || !correo || !carrera || !password) {
        res.status(400).json({ error: "Todos los campos son requeridos." });
        return;
      }
  
      // 🔒 Hashear la contraseña antes de guardarla
      const hashedPassword = await hashPassword(password);
  
      // Generar código OTP y su tiempo de expiración (5 minutos)
      const verificationCode = crypto.randomInt(100000, 999999);
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Expira en 5 minutos
  
      await pool.query(
        "INSERT INTO usuarios_temp (matricula, nombre, correo, carrera, password, otp, otp_expires) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [matricula, nombre, correo, carrera, hashedPassword, verificationCode, otpExpires]
      );
  
      // Enviar correo con código OTP
      await sendEmail(
        correo,
        "Código de verificación",
        `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>`
      );
  
      res.status(200).json({ message: "Código de verificación enviado. Verifica tu correo." });
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
