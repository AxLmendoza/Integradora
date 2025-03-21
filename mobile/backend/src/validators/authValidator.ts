import { Request, Response, NextFunction } from 'express';

// Validación para el login
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { matricula, password } = req.body;

  if (!matricula?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Matrícula y contraseña son requeridos.' });
  }

  if (!/^\d+$/.test(matricula)) {
    return res.status(400).json({ message: 'La matrícula debe contener solo números.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  next();
};

// Validación para el registro
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { matricula, nombre, correo, carrera, password } = req.body;

  if (!matricula?.trim() || !nombre?.trim() || !correo?.trim() || !carrera?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Todos los campos (matricula, nombre, correo, carrera, password) son requeridos.' });
  }

  if (!/^\d+$/.test(matricula)) {
    return res.status(400).json({ message: 'La matrícula debe contener solo números.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({ message: 'Correo electrónico no válido.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
  }

  next();
};
