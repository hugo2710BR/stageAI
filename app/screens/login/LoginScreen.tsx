"use client";

import Link from "next/link";
import { useLoginScreenHelper } from "./login.hook";

export default function LoginScreen() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    onClickSubmit,
  } = useLoginScreenHelper();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Stage<span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Entra na tua conta</p>
        </div>

        {/* Form */}
        <form onSubmit={onClickSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 caracteres"
              required
              className="w-full p-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                A entrar...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        {/* Link to register */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Nao tens conta?{" "}
          <Link
            href="/register"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
