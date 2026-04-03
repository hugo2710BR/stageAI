"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getStagingHistory, deleteStaging } from "../../lib/api";

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
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;
    getStagingHistory(token)
      .then(setStagings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  function askDelete(id: string) {
    setConfirmId(id);
  }

  function cancelDelete() {
    setConfirmId(null);
  }

  async function confirmDelete() {
    if (!confirmId || !token) return;
    setDeleting(true);
    try {
      await deleteStaging(token, confirmId);
      setStagings((prev) => prev.filter((s) => s.id !== confirmId));
      setConfirmId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erro ao apagar");
    } finally {
      setDeleting(false);
    }
  }

  return { stagings, loading, error, confirmId, deleting, askDelete, cancelDelete, confirmDelete };
}
