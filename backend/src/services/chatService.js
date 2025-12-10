const Chat = require("../models/Chat");
const User = require("../models/User");

class ChatService {
  async createDirectChat(currentUserId, otherUserEmail) {
    const otherUser = await User.findOne({ email: otherUserEmail });
    if (!otherUser) throw new Error("User not found");

    if (otherUser._id.toString() === currentUserId.toString()) {
      throw new Error("You cannot create a chat with yourself");
    }

    let chat = await Chat.findOne({
      users: { $all: [currentUserId, otherUser._id] },
    });

    if (chat) return chat;

    chat = await Chat.create({
      users: [currentUserId, otherUser._id],
    });

    return chat;
  }

  async getUserChats(userId) {
    const chats = await Chat.find({ users: userId })
      .populate("users", "-password")
      .sort({ updatedAt: -1 });

    return chats;
  }
}

module.exports = new ChatService();
