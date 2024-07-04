// userModel.js
import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const User = sequelize.define('User', {
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_Active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  picture: {
    type: DataTypes.STRING,
    defaultValue: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
  }
});

export default User;
