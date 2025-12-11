const messageService = require("../services/messageService");

class MessageController {
  async sendMessage(req, res, next) {
    try {
      const senderId = req.user.id;
      const { chatId, text } = req.body;

      const message = await messageService.createMessage(
        chatId,
        senderId,
        text
      );

      res.json(message);
    } catch (e) {
      next(e);
    }
  }

  async getChatMessages(req, res, next) {
    try {
      const { chatId } = req.params;

      const messages = await messageService.getMessagesByChat(chatId);

      res.json(messages);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new MessageController();
