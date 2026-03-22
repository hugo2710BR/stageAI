"use client";

import { useState, useRef, useCallback, MouseEvent, TouchEvent } from "react";

interface Props {
  before: string;
  after: string;
}

export default function BeforeAfterSlider({ before, after }: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  function handleMouseDown(e: MouseEvent) {
    e.preventDefault();
    isDragging.current = true;
    updatePosition(e.clientX);

    function onMove(ev: globalThis.MouseEvent) {
      if (isDragging.current) updatePosition(ev.clientX);
    }
    function onUp() {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  function handleTouchStart(e: TouchEvent) {
    isDragging.current = true;
    updatePosition(e.touches[0].clientX);

    function onMove(ev: globalThis.TouchEvent) {
      if (isDragging.current) updatePosition(ev.touches[0].clientX);
    }
    function onUp() {
      isDragging.current = false;
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    }
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm select-none touch-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Imagem "depois" (base) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="Depois" className="w-full h-auto block" />

      {/* Imagem "antes" (clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={before}
          alt="Antes"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ minWidth: containerRef.current?.clientWidth || "100%" }}
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
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
