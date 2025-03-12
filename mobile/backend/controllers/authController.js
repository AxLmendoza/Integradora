import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

export const registro = async (req, res) => {
  const { nombre, apellidos, correo, contrasena, carrera_id } = req.body;
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  try {
    // 1️⃣ Verificar si la carrera existe
    const [carreras] = await db.query(`SELECT * FROM carreras WHERE carrera_id = ?`, [carrera_id]);

    if (carreras.length === 0) {
      return res.status(400).json({ error: "La carrera especificada no existe" });
    }

    // 2️⃣ Insertar el usuario si la carrera es válida
    await db.query(
      `INSERT INTO Usuarios (nombre, apellidos, correo, contrasena, carrera_id) VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellidos, correo, hashedPassword, carrera_id]
    );

    res.status(201).json({ msg: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    res.status(500).json({ error: 'Error en el registro', details: error.message });
  }
};


export const login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const [usuarios] = await db.query(`SELECT * FROM Usuarios WHERE correo = ?`, [correo]);

    if (usuarios.length === 0) return res.status(400).json({ error: 'Usuario no encontrado' });

    const usuario = usuarios[0];
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contrasenaValida) return res.status(400).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ usuario_id: usuario.usuario_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, usuario: { nombre: usuario.nombre, correo: usuario.correo } });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
};
