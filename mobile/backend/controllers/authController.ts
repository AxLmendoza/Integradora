// controllers/authController.ts
import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/generateToken';

export const register = async (req: Request, res: Response) => {
  const { username, email, password, program } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const newUser = await User.create({ username, email, password, program });

    return res.status(201).json({ message: 'Usuario creado con éxito', user: newUser });
  } catch (error) {
    return res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(user.id);

    return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};
