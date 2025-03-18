import { Request, Response, NextFunction } from 'express';

// Validación para el login
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { matricula, password } = req.body;

  if (!matricula?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Matrícula y contraseña son requeridos.' });
  }

  next();
};

// Validación para el registro
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { matricula, nombre, password } = req.body;

  if (!matricula?.trim() || !nombre?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  next();
};
