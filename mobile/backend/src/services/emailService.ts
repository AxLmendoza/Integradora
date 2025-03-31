import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
    const msg = {
        to,
        from: "tuemail@tudominio.com", // 🔹 Usa un email verificado en SendGrid
        subject,
        content: [
            {
                type: "text/html",
                value: html,
            },
        ],
    };

    try {
        await sgMail.send(msg as any); // ✅ Agregar `as any` si TypeScript sigue quejándose
        console.log("Correo enviado con éxito.");
    } catch (error) {
        console.error("Error enviando email:", error);
        throw new Error("No se pudo enviar el email.");
    }
};
