"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/authContext";
import { getAccount, updateAccount, deleteAccount, type Account } from "@/app/lib/api";

export function useAccountHelper() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!token) return;
    getAccount(token)
      .then((data) => {
        setAccount(data);
        setEditName(data.name ?? "");
      })
      .catch(() => setError("Erro ao carregar dados da conta."))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSaveName() {
    if (!token || !editName.trim()) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await updateAccount(token, editName.trim());
      setAccount((prev) => prev ? { ...prev, name: res.name } : prev);
      setSuccess("Nome atualizado com sucesso.");
    } catch {
      setError("Erro ao atualizar nome. Tenta novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!token) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteAccount(token);
      logout();
      router.push("/");
    } catch {
      setError("Erro ao eliminar conta. Tenta novamente.");
      setDeleting(false);
    }
  }

  return {
    account,
    loading,
    saving,
    deleting,
    error,
    success,
    editName,
    setEditName,
    deleteConfirm,
    setDeleteConfirm,
    showDeleteModal,
    setShowDeleteModal,
    handleSaveName,
    handleDeleteAccount,
  };
}
