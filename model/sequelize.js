import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isLocal = process.env.DB_HOST === 'localhost';
console.log(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD,process.env.DB_PORT,'process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD');
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  dialectOptions: {
    ssl: !isLocal ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  ssl: !isLocal // Some versions of Sequelize require this too
});

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
