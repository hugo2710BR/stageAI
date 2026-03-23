"use client";

import { useState, useRef, useCallback, MouseEvent, TouchEvent } from "react";

export function useResultScreenHelper() {
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

  return {
    position,
    containerRef,
    handleMouseDown,
    handleTouchStart,
  };
}
