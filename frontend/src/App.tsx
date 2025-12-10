import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const { token } = useContext(AuthContext);

  // For now, show login page if not logged in
  return <div>{token ? <p>Logged in!</p> : <LoginPage />}</div>;
}

export default App;
