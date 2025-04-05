/*src/routes/auth.ts*/

import { Router } from 'express';
import { 
  registerUser, 
  loginUser, 
  updateName, 
  sendVerificationCode, 
  sendPasswordReset, 
  verifyOTP, 
  resetPassword 
} from "../controllers/authController";
import { validateLogin, validateRegister } from "../validators/authValidator";

const router = Router();


router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendVerificationCode);
router.post("/send-password-reset", sendPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/register", validateRegister as any, registerUser);
router.post("/login", validateLogin as any, loginUser);
router.post("/update-name", updateName);

export default router;