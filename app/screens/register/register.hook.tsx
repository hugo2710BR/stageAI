"use client";

import { useState } from "react";
import React from "react";
import { useAuth } from "@/app/contexts/authContext";
import { useRouter } from "next/navigation";

export function useRegisterScreenHelper() {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        await register(email, password, name);
        router.push("/staging");
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [register, email, password, name, router],
  );

  return {
    email,
    setEmail,
    setName,
    name,
    password,
    setPassword,
    error,
    loading,
    onClickSubmit: handleSubmit,
  };
}
