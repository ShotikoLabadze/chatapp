import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  setAuth: (token: string, userId: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  setAuth: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const setAuth = (t: string, id: string) => {
    setToken(t);
    setUserId(id);
    localStorage.setItem("token", t);
    localStorage.setItem("userId", id);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ token, userId, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
