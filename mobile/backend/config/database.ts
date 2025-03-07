// config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://user:password@localhost:3306/database', {
  dialect: 'mysql',
  logging: false,  // Para evitar que se muestren los logs de Sequelize en consola
});

export { sequelize };
