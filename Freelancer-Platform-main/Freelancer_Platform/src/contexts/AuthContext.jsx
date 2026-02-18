import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        const response = await fetch('http://localhost:5001/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.user) {
            setUser(data.user);
            setRole(data.user.role || "client");
          } else {
            localStorage.removeItem("authToken");
          }
        } else {
          localStorage.removeItem("authToken");
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.token) {
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setRole(data.user?.role || "client");
        return { error: null };
      }

      return { error: "Invalid response from server" };
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = error.message || "Sign in failed";
      return { error: errorMessage };
    }
  };

  const signUp = async (email, password, fullName, role = 'client') => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.token) {
        localStorage.setItem("authToken", data.token);
        setUser(data.user);
        setRole(data.user?.role || "client");
        return { error: null };
      }

      return { error: "Invalid response from server" };
    } catch (error) {
      console.error("Sign up error:", error);
      const errorMessage = error.message || "Sign up failed";
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await fetch('http://localhost:5001/api/auth/signout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setRole(null);
    }
  };

  const value = {
    user,
    role,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
