"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getStagingHistory } from "../../lib/api";

type Staging = {
  id: string;
  style: string;
  prompt: string | null;
  resultUrl: string | null;
  status: string;
  createdAt: string;
};

export function useHistoryHook() {
  const { token } = useAuth();
  const [stagings, setStagings] = useState<Staging[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    console.log("token", token);
    getStagingHistory(token)
      .then(setStagings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  return { stagings, loading, error };
}
