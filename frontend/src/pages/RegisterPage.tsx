import { useState, useContext } from "react";
import api, { setAuthToken } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";

export default function RegisterPage() {
  const { setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, password });
      const loginRes = await api.post("/auth/login", { email, password });
      setAuth(loginRes.data.token, loginRes.data.userId);
      setAuthToken(loginRes.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Register failed");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
