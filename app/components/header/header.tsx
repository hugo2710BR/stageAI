"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/authContext";

export const Header = () => {
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/">
        <h1 className="text-3xl font-bold text-gray-900">
          Stage<span className="text-emerald-600">AI</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Virtual home staging</p>
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/history"
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Histórico
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
