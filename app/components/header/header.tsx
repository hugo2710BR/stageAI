"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/authContext";
import { getUsage } from "../../lib/api";

interface Usage {
  plan: string;
  used: number;
  limit: number | null;
  remaining: number | null;
}

export const Header = () => {
  const { logout, token } = useAuth();
  const router = useRouter();
  const [usage, setUsage] = useState<Usage | null>(null);

  useEffect(() => {
    if (!token) return;
    getUsage(token)
      .then(setUsage)
      .catch(() => {});
  }, [token]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/staging">
        <h1 className="text-3xl font-bold text-gray-900">
          Stage<span className="text-emerald-600">AI</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Virtual home staging</p>
      </Link>
      <div className="flex items-center gap-4">
        {usage && (
          <span className="text-xs text-gray-400">
            {usage.limit === null ? (
              <span className="text-emerald-600 font-medium">∞ gerações</span>
            ) : (
              <>
                <span
                  className={
                    usage.remaining === 0
                      ? "text-red-500 font-medium"
                      : "text-emerald-600 font-medium"
                  }
                >
                  {usage.remaining}
                </span>
                /{usage.limit} gerações
              </>
            )}
          </span>
        )}
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
