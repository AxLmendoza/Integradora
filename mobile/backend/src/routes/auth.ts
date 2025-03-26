/* src/routes/auth.ts */


import { Router } from "express";
import { registerUser, loginUser, updateName } from "../controllers/authController";
import { validateLogin, validateRegister } from "../validators/authValidator";

const router = Router();

router.post("/register", validateRegister as any, registerUser);
router.post("/login", validateLogin as any, loginUser);
router.post("/update-name", updateName);

export default router;

