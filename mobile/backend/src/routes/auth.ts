import { Router } from "express";
import { registerUser, loginUser, updateName } from "../controllers/authController";
import { sendWelcomeEmail } from "../controllers/emailController"; // 📩 Asegúrate de importar correctamente
import { validateLogin, validateRegister } from "../validators/authValidator";

const router = Router();

router.post("/register", validateRegister as any, registerUser);
router.post("/login", validateLogin as any, loginUser);
router.post("/update-name", updateName);
router.post("/send-welcome", sendWelcomeEmail); // ✅ Debería estar correctamente importado

export default router;


