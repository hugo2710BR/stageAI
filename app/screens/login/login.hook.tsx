"use client";

import { useState } from "react";
import React from "react";
import { useAuth } from "@/app/contexts/authContext";
import { useRouter } from "next/navigation";

export function useLoginScreenHelper() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await login(email, password);
        router.push("/");
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [email, login, password, router],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    onClickSubmit: handleSubmit,
  };
}
