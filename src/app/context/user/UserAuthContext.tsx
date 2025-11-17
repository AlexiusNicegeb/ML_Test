import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: number;
};

const AuthContext = createContext<{
  user?: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
}>({
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setUser(undefined);
        setLoading(false);
        return;
      }

      const res = await fetch("/api/user-data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setUser(undefined);
        window.localStorage.removeItem("access_token");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Login failed");
    }

    localStorage.setItem("access_token", json.access_token);

    await fetchUserData();
  };

  const logout = async () => {
    localStorage.removeItem("access_token");
    setUser(undefined);
    router.push("/login");
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Registration failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(AuthContext);
