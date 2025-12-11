import { useState, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const { token } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (token) {
    return <ChatPage />;
  }

  return (
    <div>
      {showRegister ? <RegisterPage /> : <LoginPage />}
      <button onClick={() => setShowRegister((prev) => !prev)}>
        {showRegister ? "Go to Login" : "Go to Register"}
      </button>
    </div>
  );
}

export default App;
