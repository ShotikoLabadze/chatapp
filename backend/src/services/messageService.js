const Message = require("../models/Message");

class MessageService {
  async createMessage(chatId, senderId, text) {
    const message = await Message.create({
      chatId,
      sender: senderId,
      text,
    });
    return message;
  }

  async getMessagesByChat(chatId) {
    const messages = await Message.find({ chatId })
      .populate("sender", "email")
      .sort({ createdAt: 1 });
    return messages;
  }
}

module.exports = new MessageService();
