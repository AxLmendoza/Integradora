// server.ts
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import { sequelize } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Para parsear JSON
app.use('/auth', authRoutes); // Las rutas de autenticación

// Conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos');
  })
  .catch((err) => {
    console.error('Error al conectar con la base de datos:', err);
  });

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
