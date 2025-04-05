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
    console.log(`Verificando OTP para: ${correo}, código: ${otp}`);

    const [results]: any = await pool.query(
      "SELECT * FROM usuarios_temp WHERE correo = ?",
      [correo]
    );

    console.log(`Resultados encontrados: ${results.length}`);
    if (results.length > 0) {
      console.log(
        `OTP en DB: ${results[0].otp}, Expira: ${results[0].otp_expires}`
      );
    }

    if (results.length === 0) {
      const [verifiedUser]: any = await pool.query(
        "SELECT 1 FROM usuarios WHERE correo = ? LIMIT 1",
        [correo]
      );

      if (verifiedUser.length > 0) {
        res.status(400).json({
          error: "Este correo ya está verificado. Por favor inicia sesión.",
          code: "ALREADY_VERIFIED",
        });
        return;
      }

      res.status(404).json({
        error:
          "Usuario no encontrado o código expirado. Por favor regístrate nuevamente.",
        code: "OTP_EXPIRED",
      });
      return;
    }

    const userData = results[0];
    const now = new Date();
    const expiresAt = new Date(userData.otp_expires);

    if (userData.otp !== otp) {
      res.status(400).json({
        error: "Código OTP incorrecto.",
        code: "INVALID_OTP",
      });
      return;
    }

    if (expiresAt < now) {
      res.status(400).json({
        error: "El código ha expirado. Solicita uno nuevo.",
        code: "OTP_EXPIRED",
        expiresAt: userData.otp_expires,
        currentTime: now,
      });
      return;
    }

    // Verificar si el usuario ya existe
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

    // En tu verifyOTP controller, asegúrate de incluir esto:
    res.status(200).json({
      message: "Cuenta verificada correctamente.",
      redirectTo: "/inicio_ses", // Esta línea es crucial
      matricula: userData.matricula,
      nombre: userData.nombre,
    });
  } catch (error: any) {
    console.error("❌ Error en verifyOTP:", error);
    res.status(500).json({
      error: "Error al verificar el código OTP.",
      details: error.message,
    });
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
  } catch (error: any) {
    console.error("❌ Error en resetPassword:", error);
    res.status(500).json({
      error: "Error en el servidor.",
      details: error.message,
    });
  }
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Correo es obligatorio." });
      return;
    }

    await pool.query("DELETE FROM usuarios_temp WHERE otp_expires < NOW()");

    const [existingOTP]: any = await pool.query(
      "SELECT otp, otp_expires FROM usuarios_temp WHERE correo = ?",
      [email]
    );

    let verificationCode: number;
    let otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    if (existingOTP.length > 0) {
      const { otp, otp_expires } = existingOTP[0];

      if (new Date(otp_expires) > new Date()) {
        verificationCode = otp;
      } else {
        verificationCode = crypto.randomInt(100000, 999999);
        await pool.query(
          "UPDATE usuarios_temp SET otp = ?, otp_expires = ? WHERE correo = ?",
          [verificationCode, otpExpires, email]
        );
      }
    } else {
      verificationCode = crypto.randomInt(100000, 999999);
      await pool.query(
        "INSERT INTO usuarios_temp (correo, otp, otp_expires) VALUES (?, ?, ?)",
        [email, verificationCode, otpExpires]
      );
    }

    await sendEmail(
      email,
      "Código de verificación",
      `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>
       <p>⚠️ Este código expirará en 10 minutos.</p>`
    );

    res.json({
      message: "Código de verificación enviado.",
      expiresIn: 600, // 10 minutos en segundos
    });
  } catch (error: any) {
    console.error("❌ Error en sendVerificationCode:", error);
    res.status(500).json({
      error: "Error al enviar el código OTP.",
      details: error.message,
    });
  }
};

export const sendPasswordReset = async (req: Request, res: Response) => {
  const { correo } = req.body;

  try {
    const token = crypto.randomBytes(32).toString("hex");
    await saveResetToken(correo, token);

    const resetLink = `http://192.168.0.101:3001/reset-password?token=${token}`;
    await sendEmail(
      correo,
      "Restablecer contraseña",
      `<p>Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetLink}">Restablecer</a></p>`
    );

    res.json({ message: "Email de recuperación enviado" });
  } catch (error: any) {
    console.error("❌ Error en sendPasswordReset:", error);
    res.status(500).json({
      error: "Error al enviar email de recuperación.",
      details: error.message,
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { matricula, password } = req.body;

    if (!matricula || !password) {
      res.status(400).json({ error: "Matrícula y contraseña requeridos" });
      return;
    }

    const usuario = await verifyUser(matricula, password);
    if (!usuario || !usuario.id) {
      res.status(400).json({
        error: "Credenciales incorrectas o usuario no verificado.",
        code: "INVALID_CREDENTIALS",
      });
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
  } catch (error: any) {
    console.error("❌ Error en loginUser:", error);
    res.status(500).json({
      error: "Error en el servidor, intenta más tarde.",
      details: error.message,
    });
  }
};

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let { matricula, nombre, correo, carrera, password } = req.body;

    matricula = matricula.trim();
    nombre = nombre.trim();
    correo = correo.trim().toLowerCase();
    carrera = carrera.trim();

    const [existingUser]: any = await pool.query(
      "SELECT 1 FROM usuarios WHERE matricula = ? OR correo = ? LIMIT 1",
      [matricula, correo]
    );

    if (existingUser.length > 0) {
      res.status(400).json({
        error: "El usuario ya está registrado.",
        code: "USER_EXISTS",
      });
      return;
    }

    await pool.query("DELETE FROM usuarios_temp WHERE otp_expires < NOW()");

    const [tempUser]: any = await pool.query(
      "SELECT 1 FROM usuarios_temp WHERE matricula = ? OR correo = ? LIMIT 1",
      [matricula, correo]
    );

    if (tempUser.length > 0) {
      res.status(400).json({
        error:
          "Ya se envió un código de verificación. Revisa tu correo o espera que expire.",
        code: "PENDING_VERIFICATION",
      });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const verificationCode = crypto.randomInt(100000, 999999);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

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

    console.log("Registro temporal creado para:", correo);

    await sendEmail(
      correo,
      "Código de verificación - Expira en 10 minutos",
      `<p>Tu código de verificación es: <strong>${verificationCode}</strong></p>
       <p>⚠️ Este código expirará en 10 minutos.</p>`
    );

    res.status(200).json({
      message: "Código de verificación enviado. Verifica tu correo.",
      expiresIn: 600, // 10 minutos en segundos
    });
  } catch (error: any) {
    console.error("❌ Error en registerUser:", error);
    res.status(500).json({
      error: "Error en el servidor.",
      details: error.message,
    });
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
  } catch (error: any) {
    console.error("❌ Error en updateName:", error);
    res.status(500).json({
      error: "Error en el servidor.",
      details: error.message,
    });
  }
};
