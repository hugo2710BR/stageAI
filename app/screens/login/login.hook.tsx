"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/authContext";

export function useLoginScreenHelper() {
  // TODO: criar states: email, password, error, loading

  // TODO: criar função handleSubmit(e: React.FormEvent)
  // Dica:
  //   1. e.preventDefault() — evita reload da página
  //   2. setLoading(true) + setError("")
  //   3. try: chamar login(email, password) do useAuth
  //   4. se sucesso: router.push("/") para ir para a home
  //   5. catch: setError(err.message)
  //   6. finally: setLoading(false)

  return {
    email: "",
    setEmail: () => {},
    password: "",
    setPassword: () => {},
    error: "",
    loading: false,
    handleSubmit: () => {},
  };
}
