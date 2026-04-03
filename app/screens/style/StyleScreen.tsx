"use client";

import { useStyleScreenHelper } from "./style.hook";

export type DecorStyle =
  | "Moderno"
  | "Escandinavo"
  | "Industrial"
  | "Mediterrâneo";

interface Props {
  onSubmit: (style: DecorStyle, prompt: string) => void;
  loading: boolean;
}

const STYLES: { name: DecorStyle; emoji: string; desc: string }[] = [
  { name: "Moderno", emoji: "🏢", desc: "Linhas limpas, tons neutros" },
  { name: "Escandinavo", emoji: "🌿", desc: "Madeira clara, ambiente acolhedor" },
  { name: "Industrial", emoji: "🏭", desc: "Tijolo exposto, tons escuros" },
  { name: "Mediterrâneo", emoji: "☀️", desc: "Terracota, texturas naturais" },
];

const CHIPS = [
  "floor lamp",
  "large rug",
  "wall art",
  "indoor plants",
  "leather sofa",
  "wooden shelves",
  "large mirror",
];

export default function StyleScreen({ onSubmit, loading }: Props) {
  const {
    selected,
    setSelected,
    prompt,
    setPrompt,
    addChip,
    handleSubmit,
  } = useStyleScreenHelper({ onSubmit });

  return (
    <div className="flex flex-col gap-6">
      {/* Style grid */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Escolhe um estilo de decoracao
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {STYLES.map((s) => (
            <button
              key={s.name}
              onClick={() => setSelected(s.name)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                selected === s.name
                  ? "border-emerald-500 bg-emerald-50 shadow-sm"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-sm font-medium text-gray-800">
                {s.name}
              </span>
              <span className="text-xs text-gray-500 text-center">
                {s.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Prompt livre (opcional)
        </h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="ex: floor lamp, large rug, wall art (use English for best results)"
          className="w-full p-3 rounded-xl border border-gray-200 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => addChip(chip)}
              className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              + {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            A gerar...
          </>
        ) : (
          "✦ Mobilar com IA"
        )}
      </button>
    </div>
  );
}
