const chatService = require("../services/chatService");

class ChatController {
  async createDirectChat(req, res) {
    try {
      const userId = req.user.id;
      const { otherUserEmail } = req.body;

      const chat = await chatService.createDirectChat(userId, otherUserEmail);
      res.json(chat);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }

  async getMyChats(req, res) {
    try {
      const userId = req.user.id;
      const chats = await chatService.getUserChats(userId);

      res.json(chats);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
}

module.exports = new ChatController();
