import pool from '../config/db.js';
import bcrypt from 'bcrypt';

class UserService {
  // Buscar usuario por matrícula
  static async findByMatricula(matricula: string) {
    try {
      const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula]);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
      }
      return null;
    } catch (error) {
      console.error('Error en findByMatricula:', error);
      throw new Error('Error al buscar usuario.');
    }
  }

  // Crear usuario con contraseña encriptada, correo y carrera
  static async create(matricula: string, nombre: string, correo: string, carrera: string, password: string) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result]: any = await pool.query(
        'INSERT INTO usuarios (matricula, nombre, correo, carrera, password) VALUES (?, ?, ?, ?, ?)',
        [matricula, nombre, correo, carrera, hashedPassword]
      );
      return result.insertId;
    } catch (error) {
      console.error('Error en create:', error);
      throw new Error('Error al crear usuario.');
    }
  }
}

export default UserService;
