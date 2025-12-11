import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";

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
    <div>
      <input
        type="email"
        placeholder="Friend's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleCreateChat}>Create Chat</button>
      {error && <p>{error}</p>}
    </div>
  );
}
