import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";
import "./CreateDirectChat.css";

interface Props {
  refreshChats: () => void;
}

export default function CreateDirectChat({ refreshChats }: Props) {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!authContext) return null;
  const { token } = authContext;

  const handleCreateChat = async () => {
    try {
      await api.post(
        "/chat",
        { otherUserEmail: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmail("");
      setError("");
      refreshChats();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create chat");
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-box">
        <input
          type="email"
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="chat-input"
        />

        <button onClick={handleCreateChat} className="chat-btn">
          +
        </button>
      </div>

      {error && <p className="chat-error">{error}</p>}
    </div>
  );
}
