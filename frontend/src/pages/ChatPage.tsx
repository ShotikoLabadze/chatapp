import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { AuthContext } from "../contexts/AuthContext";
import ChatList from "../components/ChatList";
import CreateDirectChat from "../components/CreateDirectChat";
import api from "../api/api";
import { Chat } from "../types/types";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const { token, userId, logout } = useContext(AuthContext)!;
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");

  const fetchChats = async () => {
    try {
      const res = await api.get("/chat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [token]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
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

    try {
      const res = await api.post(
        `/messages`,
        { chatId: selectedChat._id, senderId: userId, text: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit("sendMessage", res.data);
      setMessageText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2>Chat App</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ width: "250px" }}>
          <h3>Your Chats</h3>
          <CreateDirectChat refreshChats={fetchChats} />
          <ChatList chats={chats} selectChat={setSelectedChat} />
        </div>

        <div style={{ flex: 1 }}>
          {selectedChat ? (
            <>
              <h3>
                Chat with: {selectedChat.users.map((u) => u.email).join(", ")}
              </h3>
              <div
                style={{
                  height: "300px",
                  overflowY: "scroll",
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                {messages.map((msg, i) => (
                  <div key={i}>
                    <b>{msg.senderId === userId ? "You" : msg.senderEmail}:</b>{" "}
                    {msg.text}
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={sendMessage}>Send</button>
            </>
          ) : (
            <p>Select a chat</p>
          )}
        </div>
      </div>
    </div>
  );
}

///2 jer gzavnis
