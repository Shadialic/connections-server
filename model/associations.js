// associations.js
import User from './userModel.js';
import Chat from './chatModel.js';
import Message from './messageModel.js';

Chat.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });
Chat.belongsTo(Message, { as: 'latestMessage', foreignKey: 'latestMessageId' });
Chat.belongsToMany(User, { through: 'ChatUsers', as: 'participants', foreignKey: 'ChatId' });
User.belongsToMany(Chat, { through: 'ChatUsers', as: 'chats', foreignKey: 'UserId' });

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(Chat, { as: 'chat', foreignKey: 'chatId' });

export { User, Chat, Message };
