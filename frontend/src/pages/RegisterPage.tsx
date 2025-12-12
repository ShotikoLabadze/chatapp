import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import "./LoginPage.css";

export default function RegisterPage() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
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
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister} className="form">
        <h2 className="title">Register</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button">
          Register
        </button>
        <button
          type="button"
          className="toggle-button"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </form>
    </div>
  );
}
