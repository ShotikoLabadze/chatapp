import { useState, useEffect, useContext, useRef } from "react";
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

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL!, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

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
    if (!selectedChat || !socketRef.current) return;

    const chatId = selectedChat._id;

    const loadMessages = async () => {
      try {
        const res = await api.get(`/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    loadMessages();

    socketRef.current.emit("joinChat", chatId);

    const handleNewMessage = (msg: any) => {
      if (msg.chatId !== chatId) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socketRef.current.on("newMessage", handleNewMessage);

    return () => {
      socketRef.current?.off("newMessage", handleNewMessage);
    };
  }, [selectedChat?._id, token]);

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    const chatId = selectedChat._id;

    const tempId = "temp-" + Date.now();
    const tempMessage = {
      _id: tempId,
      chatId,
      senderId: userId,
      senderEmail: "Me",
      text: messageText,
      pending: true,
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");

    try {
      const res = await api.post(
        "/messages",
        { chatId, text: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const savedMessage = res.data;

      setMessages((prev) =>
        prev.map((m) => (m._id === tempId ? savedMessage : m))
      );

      socketRef.current?.emit("sendMessage", savedMessage);
    } catch (err) {
      console.error("Failed to send message:", err);

      setMessages((prev) => prev.filter((m) => m._id !== tempId));
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
              {messages.map((msg) => {
                const senderName =
                  msg.senderId === userId
                    ? "Me"
                    : msg.senderEmail?.split("@")[0] || "Unknown";

                return (
                  <div key={msg._id} className="bubble">
                    <strong>{senderName}:</strong> {msg.text}
                  </div>
                );
              })}
            </div>

            <div className="input-area">
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
