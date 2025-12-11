const Message = require("../models/Message");

class MessageService {
  async createMessage(chatId, senderId, text) {
    const message = await Message.create({
      chatId,
      sender: senderId,
      text,
    });

    await message.populate("sender", "email");

    return {
      _id: message._id,
      text: message.text,
      chatId: message.chatId,
      senderId: message.sender?._id || senderId,
      senderEmail: message.sender?.email || "Unknown",
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  async getMessagesByChat(chatId) {
    const messages = await Message.find({ chatId })
      .populate("sender", "email")
      .sort({ createdAt: 1 });

    return messages.map((m) => ({
      _id: m._id,
      text: m.text,
      chatId: m.chatId,
      senderId: m.sender?._id || null,
      senderEmail: m.sender?.email || "Unknown",
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }
}

module.exports = new MessageService();
