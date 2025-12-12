const messageService = require("./services/messageService");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
      const message = await messageService.createMessage(
        chatId,
        senderId,
        text
      );

      io.to(chatId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
