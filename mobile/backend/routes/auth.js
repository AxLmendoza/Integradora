import express from 'express';
import { registerUser, loginUser, updateName } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update-name', updateName);

export default router;
