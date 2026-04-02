"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { loginUser, registerUser } from "../lib/api";
import Cookies from "js-cookie";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(Cookies.get("token") ?? null);

  async function login(email: string, password: string) {
    const res = await loginUser(email, password);
    setToken(res.access_token);
    Cookies.set("token", res.access_token);
  }

  async function register(email: string, password: string, name?: string) {
    const res = await registerUser(email, password, name);
    setToken(res.access_token);
    Cookies.set("token", res.access_token);
  }

  function logout() {
    setToken(null);
    Cookies.remove("token");
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
