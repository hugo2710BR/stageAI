"use client";

import Image from "next/image";
import { useHistoryHook } from "./history.hook";

export function HistoryScreen() {
  const { stagings, loading, error } = useHistoryHook();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500">A carregar histórico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (stagings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-500">
          Ainda não tens stagings. Cria o primeiro!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stagings.map((s) => (
        <div
          key={s.id}
          className="rounded-xl overflow-hidden border border-gray-200 shadow-sm"
        >
          {s.resultUrl ? (
            <Image
              src={s.resultUrl}
              alt={s.style}
              className="w-full h-48 object-cover"
              width={512}
              height={192}
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                {s.status === "processing" ? "A processar..." : "Sem imagem"}
              </p>
            </div>
          )}
          <div className="p-4">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
              {s.style}
            </span>
            {s.prompt && (
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {s.prompt}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-2">
              {new Date(s.createdAt).toLocaleDateString("pt-PT")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
