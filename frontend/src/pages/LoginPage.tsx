import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/api";
import { AuthContext } from "../contexts/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.token, res.data.userId);
      setAuthToken(res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="form">
        <h2 className="title">Login</h2>
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
          Login
        </button>
        <button
          type="button"
          className="toggle-button"
          onClick={() => navigate("/register")}
        >
          Go to Register
        </button>
      </form>
    </div>
  );
}
