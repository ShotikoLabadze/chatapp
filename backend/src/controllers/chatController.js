const Chat = require("../models/Chat");
const User = require("../models/User");

exports.createDirectChat = async (req, res) => {
  try {
    const meId = req.user.id;
    const { otherUserEmail } = req.body;

    if (!otherUserEmail)
      return res.status(400).json({ error: "Email required" });

    const friend = await User.findOne({
      email: otherUserEmail.toLowerCase().trim(),
    });
    if (!friend) return res.status(400).json({ error: "User not found" });
    if (friend.id === meId)
      return res.status(400).json({ error: "Cannot chat with yourself" });

    const existingChat = await Chat.findOne({
      users: { $all: [meId, friend.id] },
    });
    if (existingChat)
      return res.status(400).json({ error: "Chat already exists" });

    const newChat = await Chat.create({ users: [meId, friend.id] });
    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getChats = async (req, res) => {
  try {
    const meId = req.user.id;
    const chats = await Chat.find({ users: meId }).populate("users", "email");
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
