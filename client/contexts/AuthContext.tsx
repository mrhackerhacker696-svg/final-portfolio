import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  // Mongo-only mode: do not use localStorage, keep in-memory auth
  useEffect(() => { }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Hardcoded credentials as requested
    const validEmail = "kanuprajapati717@gmail.com";
    const validPassword = "kanu1233";

    if (email === validEmail && password === validPassword) {
      const userData: User = {
        email: email,
        name: "Kanu Prajapati",
      };
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
