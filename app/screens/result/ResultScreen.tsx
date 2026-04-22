"use client";

import { useResultScreenHelper } from "./result.hook";

interface Props {
  before: string;
  after: string;
  fixed?: boolean;
}

export default function ResultScreen({ before, after, fixed = false }: Props) {
  const {
    position,
    containerRef,
    handleMouseDown,
    handleTouchStart,
  } = useResultScreenHelper();

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm select-none touch-none ${fixed ? "h-full" : "max-w-2xl mx-auto"}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="Depois" className={`w-full block ${fixed ? "h-full object-cover" : "h-auto"}`} />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="Antes" className="absolute inset-0 w-full h-full object-cover block" />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-gray-500 text-sm font-bold select-none">
            ⇔
          </span>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 rounded-lg text-white text-xs font-medium">
        Antes
      </div>
      <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 rounded-lg text-white text-xs font-medium">
        Depois ✦
      </div>
    </div>
  );
}
