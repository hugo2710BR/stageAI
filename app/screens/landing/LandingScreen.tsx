"use client";

import Link from "next/link";

const STEPS = [
  {
    number: "01",
    title: "Upload a photo",
    desc: "Upload a photo of your empty or semi-furnished room.",
  },
  {
    number: "02",
    title: "Paint the area",
    desc: "Brush over the zone you want to furnish. The rest stays untouched.",
  },
  {
    number: "03",
    title: "Choose a style",
    desc: "Pick Modern, Scandinavian, Industrial or Mediterranean and let AI do the rest.",
  },
];

export default function LandingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">

      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-gray-900">
          Stage<span className="text-emerald-600">AI</span>
        </span>
        <nav className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          AI-powered home staging
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Transform any room
          <br />
          <span className="text-emerald-600">in seconds.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Upload a photo, paint the area you want to furnish, pick a style — and let AI generate a stunning result. No designers, no renders, no waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Sign in
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-4">3 free generations on signup. No credit card required.</p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-4">
                <span className="text-4xl font-bold text-emerald-100 select-none">
                  {step.number}
                </span>
                <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} StageAI. All rights reserved.
      </footer>
    </div>
  );
}
