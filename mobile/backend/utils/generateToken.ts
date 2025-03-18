import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string;

if (!SECRET_KEY) {
  throw new Error('Falta la variable de entorno JWT_SECRET');
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ usuario_id: userId }, SECRET_KEY, { expiresIn: '1h' });
};
