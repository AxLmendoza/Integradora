import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';


export const loginUser = async (req, res) => {
  try {
    const { matricula, password } = req.body;
    if (!matricula || !password) {
      return res.status(400).json({ error: 'Matrícula y contraseña requeridos' });
    }
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula]);
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }
    const usuario = rows[0];
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }
    // Generar un token JWT (expira en 1 hora)
    const token = jwt.sign(
      { id: usuario.id, matricula: usuario.matricula },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '1h' }
    );
    return res.status(200).json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error('Error en loginUser:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

export const updateName = async (req, res) => {
  const { matricula, nombre } = req.body;
  if (!matricula || !nombre) {
    return res.status(400).json({ error: 'Matrícula y nombre son requeridos' });
  }
  try {
    const [rows] = await pool.query('SELECT nombre FROM usuarios WHERE matricula = ?', [matricula]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const currentName = rows[0].nombre;
    if (currentName !== nombre) {
      await pool.query('UPDATE usuarios SET nombre = ? WHERE matricula = ?', [nombre, matricula]);
      return res.json({ message: 'Nombre actualizado correctamente' });
    }
    res.json({ message: 'El nombre ya estaba actualizado' });
  } catch (error) {
    console.error('Error en updateName:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

  export const registerUser = async (req, res) => {
    try {
      const { matricula, nombre, correo, carrera, password } = req.body;
      if (!matricula || !nombre || !correo || !carrera || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
      }
      // Verificar si el usuario ya existe
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE matricula = ?', [matricula]);
      if (rows.length > 0) {
        return res.status(400).json({ error: 'La matrícula ya está registrada' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      // Actualiza la consulta para insertar los nuevos campos: correo y carrera
      const [result] = await pool.query(
        'INSERT INTO usuarios (matricula, nombre, correo, carrera, password) VALUES (?, ?, ?, ?, ?)',
        [matricula, nombre, correo, carrera, hashedPassword]
      );
      console.log("Usuario insertado con ID:", result.insertId);
      return res.status(201).json({ message: 'Usuario registrado correctamente', userId: result.insertId });
    } catch (error) {
      console.error('Error en registerUser:', error);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  };
  
