import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import { Op } from 'sequelize';

const sendMessae = async (req, res) => {
  try {
    const { content, chatId ,file} = req.body;
    if (!content || !chatId) {
      res.json({ message: "Invalid data passed" });
      return; 
    }
    const newMessage = {
      senderId: req.userId,
      content: content,
      chatId: chatId,
      file:file
    };
    const message = await Message.create(newMessage);
    const newmessages = await Message.findOne({
      where: { id: message.id },
      include: [
        {
          model: User,
          as: "sender",
          attributes: { exclude: ["password"] },
        },
        {
          model: Chat,
          as: "chat",
          include: [
            {
              model: User,
              as: "participants", 
              attributes: { exclude: ["password"] },
            },
          ],
        },
      ],
    });
    if (newmessages.chat) {
      for (let chat of [newmessages.chat]) {
        const userIds = chat.users;
        const users = await User.findAll({
          where: {
            id: userIds,
          },
          attributes: { exclude: ["password"] },
        });
        chat.dataValues.participants = users;
      }
    }
    
    await Chat.update(
      {
        latestMessageId: message.id,
        updatedAt: new Date(),
      },
      {
        where: { id: chatId },
      }
    );
    res.json(newmessages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" }); 
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: {
        model: User,
        as: 'participants',
        attributes: ['id'],
      },
    });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    const participantIds = chat.participants.map((participant) => participant.id);
    const messages = await Message.findAll({
      where: {
        chatId: {
          [Op.or]: participantIds.map((id) => ({
            [Op.eq]: chatId, 
          })),
        },
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: { exclude: ['password'] },
        },
        {
          model: Chat,
          as: 'chat',
          include: [
            {
              model: User,
              as: 'participants',
              attributes: { exclude: ['password'] },
              through: { attributes: [] },
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.destroy({
      where: { id: id },
    });
    if (deleted === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

const editMessage = async (req, res) => {
  try {
    const { newContent, messageId } = req.body.data;
    const updatedMessage = await Message.update(
      { content: newContent },
      { where: { id: messageId } }
    );
    if (updatedMessage[0] === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update message' });
  }
};



export { sendMessae, getAllMessages,deleteMessage,editMessage};
