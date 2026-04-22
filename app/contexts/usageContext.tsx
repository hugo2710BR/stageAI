"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { getUsage } from "../lib/api";
import { useAuth } from "./authContext";

type Usage = {
  plan: string;
  used: number;
  limit: number | null;
  remaining: number | null;
};

type UsageContextType = {
  usage: Usage | null;
  refreshUsage: () => void;
};

const UsageContext = createContext<UsageContextType>({} as UsageContextType);

export function UsageProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [usage, setUsage] = useState<Usage | null>(null);

  const refreshUsage = useCallback(() => {
    if (!token) return;
    getUsage(token).then(setUsage).catch(() => {});
  }, [token]);

  useEffect(() => {
    setUsage(null);
    refreshUsage();
  }, [refreshUsage]);

  return (
    <UsageContext.Provider value={{ usage, refreshUsage }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  return useContext(UsageContext);
}
