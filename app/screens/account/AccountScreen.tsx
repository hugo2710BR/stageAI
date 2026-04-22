"use client";

import Link from "next/link";
import { Header } from "@/app/components";
import { useAccountHelper } from "./account.hook";

export default function AccountScreen() {
  const {
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
  } = useAccountHelper();

  return (
    <main className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Header />

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Dados pessoais */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Dados pessoais</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Nome</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving || !editName.trim()}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? "A guardar..." : "Guardar"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                  <p className="text-sm text-gray-700 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    {account?.email}
                  </p>
                </div>
              </div>
              {success && <p className="mt-3 text-sm text-emerald-600">{success}</p>}
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </section>

            {/* Plano atual */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Plano</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{account?.planDisplayName}</p>
                  {account?.planUpgradedAt && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Ativo desde {new Date(account.planUpgradedAt).toLocaleDateString("pt-PT")}
                    </p>
                  )}
                </div>
                {account?.plan !== "agency" && (
                  <Link
                    href="/pricing"
                    className="px-4 py-2 text-sm font-medium border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Gerações este mês</p>
                  <p className="text-xs font-medium text-gray-700">
                    {account?.used}
                    {account?.limit !== null ? ` / ${account?.limit}` : ""}
                  </p>
                </div>
                {account?.limit !== null && (
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((account?.used ?? 0) / (account?.limit ?? 1)) * 100)}%` }}
                    />
                  </div>
                )}
                {account?.limit === null && (
                  <p className="text-xs text-emerald-600 font-medium">Gerações ilimitadas</p>
                )}
              </div>
            </section>

            {/* Zona de perigo */}
            <section className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-red-700 mb-2">Zona de perigo</h2>
              <p className="text-sm text-gray-500 mb-4">
                Eliminar a conta apaga permanentemente todos os teus dados e imagens. Esta ação é irreversível.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 text-sm font-medium border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
              >
                Eliminar conta
              </button>
            </section>
          </div>
        )}

        {/* Modal de confirmação */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
              <h3 className="text-base font-semibold text-gray-900 mb-2">Tens a certeza?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Esta ação é irreversível. Escreve <span className="font-mono font-semibold text-red-600">ELIMINAR</span> para confirmar.
              </p>
              <input
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="ELIMINAR"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                  className="flex-1 px-4 py-2 text-sm font-medium border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== "ELIMINAR" || deleting}
                  className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? "A eliminar..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
