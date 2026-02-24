import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role?: "admin" | "user";
};

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  signup: (userData: any) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // ✅ Load user from localStorage on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("spmos_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Signup Function
  const signup = async (userData: any) => {
    try {
      const res = await fetch("http://localhost:5001/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      // 🧠 Handle non-JSON or failed responses safely
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) throw new Error(data.message || "Signup failed");

      // ✅ Store user locally
      localStorage.setItem("spmos_user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Signup Error:", err);
      throw err;
    }
  };

  // ✅ Login Function
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 🧠 Read as text first (to catch any HTML errors like "<!DOCTYPE>")
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid JSON received from backend:", text);
        throw new Error("Server returned invalid response (not JSON)");
      }

      if (!res.ok) throw new Error(data.message || "Login failed");

      // ✅ Store and update state
      localStorage.setItem("spmos_user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Login Error:", err);
      throw err;
    }
  };

  // ✅ Logout Function
  const logout = () => {
    localStorage.removeItem("spmos_user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin: user?.role === "admin", user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook to use Auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
