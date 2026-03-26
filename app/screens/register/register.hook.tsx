"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/authContext";

export function useRegisterScreenHelper() {
  // TODO: criar states: email, password, name, error, loading

  // TODO: criar função handleSubmit(e: React.FormEvent)
  // Dica:
  //   1. e.preventDefault()
  //   2. setLoading(true) + setError("")
  //   3. try: chamar register(email, password, name) do useAuth
  //   4. se sucesso: router.push("/") para ir para a home
  //   5. catch: setError(err.message)
  //   6. finally: setLoading(false)

  return {
    email: "",
    setEmail: () => {},
    password: "",
    setPassword: () => {},
    name: "",
    setName: () => {},
    error: "",
    loading: false,
    handleSubmit: () => {},
  };
}
