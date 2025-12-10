require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

const messageService = require("./services/messageService");

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on("sendMessage", async ({ chatId, senderId, text }) => {
    const message = await messageService.createMessage(chatId, senderId, text);
    io.to(chatId).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => server.listen(5000, () => console.log("Server running on 5000")))
  .catch((err) => console.error(err));
