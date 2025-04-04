/* src/controllers/authController.ts */

import { Request, Response } from "express";
import { verifyUser, getUserByMatricula } from "../models/User";
import { generateToken } from "../middlewares/authMiddleware";
import pool from "../config/db";
import { sendEmail } from "../utils/email";
import crypto from "crypto";
import { saveVerificationCode, saveResetToken } from "../models/User";
import { hashPassword } from "../utils/passwordUtils";

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { correo, otp } = req.body;

  if (!correo || !otp) {
    res.status(400).json({ error: "Correo y código OTP son obligatorios." });
    return;
  }

  try {
    // Primero eliminamos registros expirados
    await pool.query("DELETE FROM usuarios_temp WHERE otp_expires < NOW()");

    const [results]: any = await pool.query(
      "SELECT * FROM usuarios_temp WHERE correo = ?",
      [correo]
    );

    if (results.length === 0) {
      res.status(404).json({
        error:
          "Usuario no encontrado o código expirado. Por favor regístrate nuevamente.",
        code: "OTP_EXPIRED",
      });
      return;
    }

    const userData = results[0];

    if (userData.otp !== otp) {
      res.status(400).json({ error: "Código OTP incorrecto." });
      return;
    }

    // Verificar si el usuario ya existe (protección contra doble registro)
    const [existingUser]: any = await pool.query(
      "SELECT 1 FROM usuarios WHERE matricula = ? OR correo = ? LIMIT 1",
      [userData.matricula, userData.correo]
    );

    if (existingUser.length > 0) {
      res.status(400).json({ error: "El usuario ya está registrado." });
      return;
    }

    // Mover usuario a tabla permanente
    await pool.query(
      "INSERT INTO usuarios (matricula, nombre, correo, carrera, password) VALUES (?, ?, ?, ?, ?)",
      [
        userData.matricula,
        userData.nombre,
        userData.correo,
        userData.carrera,
        userData.password,
      ]
    );

    // Eliminar el registro temporal
    await pool.query("DELETE FROM usuarios_temp WHERE correo = ?", [correo]);

    res.status(200).json({
      message: "Cuenta verificada correctamente.",
      matricula: userData.matricula,
      nombre: userData.nombre,
    });
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
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Correo es obligatorio." });
      return;
    }

    // ✅ Eliminar códigos expirados
    await pool.query("DELETE FROM usuarios_temp WHERE otp_expires < NOW()");

    // ✅ Verificar si el usuario ya tiene un código válido
    const [existingOTP]: any = await pool.query(
      "SELECT otp, otp_expires FROM usuarios_temp WHERE correo = ?",
      [email]
    );

    let verificationCode: number;
    let otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Expira en 5 minutos

    if (existingOTP.length > 0) {
      const { otp, otp_expires } = existingOTP[0];

      // ✅ Si el código aún es válido, reenviarlo en lugar de generar uno nuevo
      if (new Date(otp_expires) > new Date()) {
        verificationCode = otp;
      } else {
        // ✅ Si el código ha expirado, generar uno nuevo
        verificationCode = crypto.randomInt(100000, 999999);
        await pool.query(
          "UPDATE usuarios_temp SET otp = ?, otp_expires = ? WHERE correo = ?",
          [verificationCode, otpExpires, email]
        );
      }
    } else {
      // ✅ Si no hay código previo, generar uno nuevo
      verificationCode = crypto.randomInt(100000, 999999);
      await pool.query(
        "INSERT INTO usuarios_temp (correo, otp, otp_expires) VALUES (?, ?, ?)",
        [email, verificationCode, otpExpires]
      );
    }

    // ✅ Enviar el código por correo
    await sendEmail(
      email,
      "Código de verificación",
      `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>
       <p>⚠️ Este código expirará en 5 minutos.</p>`
    );

    res.json({ message: "Código de verificación enviado." });
  } catch (error) {
    console.error("❌ Error en sendVerificationCode:", error);
    res.status(500).json({ error: "Error al enviar el código OTP." });
  }
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
      res
        .status(400)
        .json({ error: "Credenciales incorrectas o usuario no verificado." });
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

/**
 * Registra temporalmente a un usuario y envía un código OTP a su correo.
 * Verifica duplicados en usuarios y usuarios_temp. Elimina registros expirados.
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { matricula, nombre, correo, carrera, password } = req.body;

    // ✅ Sanitizar entradas
    matricula = matricula.trim();
    nombre = nombre.trim();
    correo = correo.trim().toLowerCase();
    carrera = carrera.trim();

    // ✅ Verificar si ya está registrado permanentemente
    const [existingUser]: any = await pool.query(
      "SELECT 1 FROM usuarios WHERE matricula = ? OR correo = ? LIMIT 1",
      [matricula, correo]
    );

    if (existingUser.length > 0) {
      res.status(400).json({ error: "El usuario ya está registrado." });
      return;
    }

    // ✅ Eliminar registros expirados (por seguridad y limpieza)
    await pool.query("DELETE FROM usuarios_temp WHERE otp_expires < NOW()");

    // ✅ Verificar si ya se envió un código antes que aún no expira
    const [tempUser]: any = await pool.query(
      "SELECT 1 FROM usuarios_temp WHERE matricula = ? OR correo = ? LIMIT 1",
      [matricula, correo]
    );

    if (tempUser.length > 0) {
      res.status(400).json({
        error:
          "Ya se envió un código de verificación. Revisa tu correo o espera que expire para volver a intentar.",
      });
      return;
    }

    // ✅ Hashear contraseña
    const hashedPassword = await hashPassword(password);

    // ✅ Generar código OTP de 6 dígitos y expiración de 1 minuto
    const verificationCode = crypto.randomInt(100000, 999999);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Ahora dura 5 minutos

    // ✅ Insertar en tabla temporal
    await pool.query(
      `INSERT INTO usuarios_temp 
       (matricula, nombre, correo, carrera, password, otp, otp_expires) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        matricula,
        nombre,
        correo,
        carrera,
        hashedPassword,
        verificationCode,
        otpExpires,
      ]
    );

    // ✅ Enviar correo con código
    await sendEmail(
      correo,
      "Código de verificación - Expira en 5 minutos",
      `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>
       <p>⚠️ Este código expirará en 5 minutos.</p>`
    );

    // ✅ Respuesta exitosa
    res.status(200).json({
      message: "Código de verificación enviado. Verifica tu correo.",
      expiresIn: 300, // segundos (1 minuto)
    });
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
