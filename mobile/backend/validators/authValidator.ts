// validators/authValidator.ts
import { body } from 'express-validator';

export const registerValidator = [
  body('username').isString().withMessage('El nombre de usuario es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('program').notEmpty().withMessage('El programa educativo es obligatorio'),
];

export const loginValidator = [
  body('username').isString().withMessage('El nombre de usuario es obligatorio'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña es obligatoria'),
];
