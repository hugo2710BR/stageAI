"use client";

import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "€0",
    period: "/mês",
    limit: "3 gerações/mês",
    features: ["3 imagens por mês", "Todos os estilos", "Download em alta qualidade"],
    cta: "Plano atual",
    highlighted: false,
    disabled: true,
  },
  {
    name: "Starter",
    price: "€9",
    period: "/mês",
    limit: "30 gerações/mês",
    features: ["30 imagens por mês", "Todos os estilos", "Download em alta qualidade", "Histórico completo"],
    cta: "Em breve",
    highlighted: false,
    disabled: true,
  },
  {
    name: "Pro",
    price: "€29",
    period: "/mês",
    limit: "100 gerações/mês",
    features: ["100 imagens por mês", "Todos os estilos", "Download em alta qualidade", "Histórico completo", "Suporte prioritário"],
    cta: "Em breve",
    highlighted: true,
    disabled: true,
  },
  {
    name: "Agency",
    price: "€99",
    period: "/mês",
    limit: "Gerações ilimitadas",
    features: ["Gerações ilimitadas", "Todos os estilos", "Download em alta qualidade", "Histórico completo", "Suporte dedicado"],
    cta: "Em breve",
    highlighted: false,
    disabled: true,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
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
                <p className="text-sm font-medium text-gray-500">{plan.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {plan.price}
                  <span className="text-base font-normal text-gray-400">
                    {plan.period}
                  </span>
                </p>
                <p className="text-sm text-emerald-600 font-medium mt-1">
                  {plan.limit}
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
                disabled={plan.disabled}
                className={`mt-auto rounded-xl py-2 text-sm font-semibold transition ${
                  plan.highlighted
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          Pagamentos via Stripe — em breve.{" "}
          <Link href="/staging" className="text-emerald-600 hover:underline">
            Voltar à app
          </Link>
        </p>
      </div>
    </main>
  );
}
