import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isLocal = process.env.DB_HOST === 'localhost';

console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_HOST:", process.env.DB_HOST);

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10), // Ensure the port is a number
  dialect: 'postgres',
  dialectOptions: {
    ssl: isLocal ? false : { // Conditional SSL based on environment
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: console.log
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
