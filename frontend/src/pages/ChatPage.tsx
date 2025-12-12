import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext";
import ChatList from "../components/ChatList";
import CreateDirectChat from "../components/CreateDirectChat";
import api from "../api/api";
import { Chat } from "../types/types";
import "../pages/ChatPage.css";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const { token, userId, logout } = useContext(AuthContext)!;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  const fetchChats = async () => {
    const res = await api.get("/chat", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats(res.data);
  };

  useEffect(() => {
    fetchChats();
  }, [token]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      const res = await api.get(`/messages/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    };

    fetchMessages();

    socket.emit("joinChat", selectedChat._id);

    socket.on("newMessage", (message) => {
      if (message.chatId === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [selectedChat, token]);

  const sendMessage = async () => {
    if (!messageText || !selectedChat) return;

    const res = await api.post(
      `/messages`,
      { chatId: selectedChat._id, senderId: userId, text: messageText },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    socket.emit("sendMessage", res.data);
    setMessageText("");
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
              {messages.map((msg, i) => (
                <div
                  key={i}
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
///2 jer gzavnis
