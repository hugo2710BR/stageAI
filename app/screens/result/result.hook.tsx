import {
  useState,
  useRef,
  useCallback,
  MouseEvent,
  TouchEvent,
  useEffect,
} from "react";

export function useResultScreenHelper() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

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
    setIsDragging(true);
    updatePosition(e.clientX);
  }

  function handleTouchStart(e: TouchEvent) {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  }

  useEffect(() => {
    if (!isDragging) return;
    function onMove(ev: globalThis.MouseEvent) {
      updatePosition(ev.clientX);
    }
    function onUp() {
      setIsDragging(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;
    function onMove(ev: globalThis.TouchEvent) {
      updatePosition(ev.touches[0].clientX);
    }
    function onUp() {
      setIsDragging(false);
    }
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [isDragging]);

  return {
    position,
    containerRef,
    handleMouseDown,
    handleTouchStart,
  };
}
