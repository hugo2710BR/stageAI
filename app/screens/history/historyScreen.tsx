"use client";

import Image from "next/image";
import { useHistoryHook } from "./history.hook";

export function HistoryScreen() {
  const { stagings, loading, error, confirmId, deleting, askDelete, cancelDelete, confirmDelete } = useHistoryHook();

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
        <p className="text-gray-500">Ainda não tens stagings. Cria o primeiro!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stagings.map((s) => (
          <div key={s.id} className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <button
              onClick={() => askDelete(s.id)}
              className="absolute top-2 right-2 z-10 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-red-500 hover:bg-red-50"
            >
              ✕
            </button>
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
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{s.prompt}</p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                {new Date(s.createdAt).toLocaleDateString("pt-PT")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {confirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Apagar staging?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Esta ação é irreversível. A imagem será apagada do histórico e do armazenamento.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? "A apagar..." : "Apagar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
