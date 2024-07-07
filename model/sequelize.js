import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isLocal = process.env.DB_HOST === 'localhost';

// const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10), 
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: isLocal ? false : { 
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   logging: console.log
// });

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // This is for self-signed certificates
    }
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
