"use client";

import Link from "next/link";
import ResultScreen from "../result/ResultScreen";

const STEPS = [
  {
    number: "01",
    title: "Upload a photo",
    desc: "Upload a photo of your empty or semi-furnished room.",
  },
  {
    number: "02",
    title: "Choose a style",
    desc: "Pick Modern, Scandinavian, Industrial or Mediterranean and let AI do the rest.",
  },
  {
    number: "03",
    title: "Get your result",
    desc: "Download your staged photo in seconds. No designers, no waiting.",
  },
];

const EXAMPLES = [
  { before: "/examples/before1.png", after: "/examples/after1.png" },
  { before: "/examples/before2.png", after: "/examples/after2.png" },
  { before: "/examples/before3.png", after: "/examples/after3.png" },
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
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          AI-powered home staging
        </span>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Transform any room
          <br />
          <span className="text-emerald-600">in seconds.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Upload a photo, pick a style — and let AI generate a stunning staged result. No designers, no renders, no waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Try it now
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            See the difference
          </h2>
          <p className="text-gray-500 text-center mb-12 text-sm">
            Drag the slider to compare before and after.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="aspect-video">
                <ResultScreen before={ex.before} after={ex.after} fixed />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
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
