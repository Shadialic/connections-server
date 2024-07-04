// messageModel.js
import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  file: {
    type: DataTypes.STRING,
  },
  chatId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Chats',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

export default Message;
