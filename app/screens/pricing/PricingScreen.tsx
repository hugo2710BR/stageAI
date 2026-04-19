"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPlans, createCheckout, type Plan } from "../../lib/api";
import { useAuth } from "../../contexts/authContext";

export default function PricingScreen() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleUpgrade(plan: Plan) {
    if (!plan.lsVariantId || !token) return;
    setCheckoutLoading(plan.name);
    try {
      const url = await createCheckout(token, plan.name);
      window.location.href = url;
    } catch {
      setCheckoutLoading(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/staging" className="text-3xl font-bold text-gray-900">
            Stage<span className="text-emerald-600">AI</span>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
            Planos e Preços
          </h2>
          <p className="text-gray-500">
            Escolhe o plano que melhor se adapta às tuas necessidades.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col gap-4 border ${
                  plan.highlighted
                    ? "border-emerald-500 bg-white shadow-lg"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 rounded-full px-3 py-1 self-start">
                    Popular
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">{plan.displayName}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {plan.price === 0 ? "€0" : `€${plan.price}`}
                    <span className="text-base font-normal text-gray-400">/mês</span>
                  </p>
                  <p className="text-sm text-emerald-600 font-medium mt-1">
                    {plan.limit === null ? "Gerações ilimitadas" : `${plan.limit} gerações/mês`}
                  </p>
                </div>

                <ul className="flex flex-col gap-2 text-sm text-gray-600 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-emerald-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={!plan.lsVariantId || checkoutLoading === plan.name}
                  onClick={() => handleUpgrade(plan)}
                  className={`mt-auto rounded-xl py-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                    plan.lsVariantId
                      ? plan.highlighted
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        : "bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {checkoutLoading === plan.name ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : plan.name === "free" ? (
                    "Plano atual"
                  ) : plan.lsVariantId ? (
                    "Upgrade"
                  ) : (
                    "Em breve"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-10">
          Pagamentos processados por Lemon Squeezy.{" "}
          <Link href="/staging" className="text-emerald-600 hover:underline">
            Voltar à app
          </Link>
        </p>
      </div>
    </main>
  );
}
