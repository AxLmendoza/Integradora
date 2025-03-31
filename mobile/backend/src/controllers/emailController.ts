import { Request, Response } from "express";
import asyncHandler from "express-async-handler"; // ✅ Usa express-async-handler para manejar errores automáticamente
import { sendEmail } from "../services/emailService";

export const sendWelcomeEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email, name } = req.body;

    if (!email || !name) {
        res.status(400).json({ message: "Faltan datos" });
        return;
    }

    await sendEmail({
        to: email,
        subject: "¡Bienvenido a Chipmunks Network! 🐿️",
        html: `<h1>Hola ${name}!</h1><p>Gracias por registrarte en nuestra plataforma.</p>`,
    });

    res.status(200).json({ message: "Email enviado con éxito." });
});
