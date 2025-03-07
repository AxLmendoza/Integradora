// utils/generateToken.ts
import jwt from 'jsonwebtoken';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, 'your_jwt_secret', { expiresIn: '1h' });
};
