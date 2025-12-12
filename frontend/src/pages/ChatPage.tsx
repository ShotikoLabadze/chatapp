import { useState, useEffect, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext";
import ChatList from "../components/ChatList";
import CreateDirectChat from "../components/CreateDirectChat";
import api from "../api/api";
import { Chat } from "../types/types";
import "../pages/ChatPage.css";

export default function ChatPage() {
  const { token, userId, logout } = useContext(AuthContext)!;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchChats = async () => {
    try {
      const res = await api.get("/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [token]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!selectedChat || !socket) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
    socket.emit("joinChat", selectedChat._id);

    const handleNewMessage = (message: any) => {
      if (
        message.chatId === selectedChat._id &&
        !messages.some((m) => m._id === message._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedChat, socket, token, messages]);

  const sendMessage = async () => {
    if (!messageText || !selectedChat) return;

    const tempMessage = {
      _id: "temp-" + Date.now(),
      chatId: selectedChat._id,
      senderId: userId,
      text: messageText,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");

    try {
      const res = await api.post(
        `/messages`,
        { chatId: selectedChat._id, senderId: userId, text: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((prev) =>
        prev.map((m) => (m._id === tempMessage._id ? res.data : m))
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempMessage._id));
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <CreateDirectChat refreshChats={fetchChats} />
        <ChatList chats={chats} selectChat={setSelectedChat} />
      </div>

      <div className="chat-window">
        {!selectedChat ? (
          <div className="no-chat-selected">Select a chat</div>
        ) : (
          <>
            <div className="chat-header">
              {selectedChat.users.map((u) => u.email).join(", ")}
            </div>

            <div className="messages-area">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={msg.senderId === userId ? "bubble me" : "bubble"}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="input-area">
              <input
                type="text"
                value={messageText}
                placeholder="Type a message..."
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
