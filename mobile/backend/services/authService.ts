// services/authService.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
};
