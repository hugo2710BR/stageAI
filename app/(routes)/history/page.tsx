"use client";

import { Header } from "../../components/header";
import { HistoryScreen } from "../../screens/history/historyScreen";

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <Header />
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Os teus stagings
        </h2>
        <HistoryScreen />
      </div>
    </main>
  );
}
