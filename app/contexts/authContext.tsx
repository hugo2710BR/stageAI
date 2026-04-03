"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { loginUser, registerUser } from "../lib/api";
import Cookies from "js-cookie";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function getValidToken(): string | null {
  const token = Cookies.get("token") ?? null;
  if (!token || isTokenExpired(token)) {
    Cookies.remove("token");
    return null;
  }
  return token;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getValidToken);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        setToken(null);
        Cookies.remove("token");
      }
    }, 30 * 1000);
    return () => clearInterval(interval);
  }, [token]);

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
