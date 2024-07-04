import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config(); 

export const createSecretToken = (id,userName, email,picture) => {
  return jwt.sign({ id, userName, email,picture }, process.env.JWT_SECRET_KEY, {
    expiresIn: 3 * 24 * 60 * 60, 
  });
};
