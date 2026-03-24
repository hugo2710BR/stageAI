import {
  useRef,
  useEffect,
  useState,
  useCallback,
  MouseEvent,
  TouchEvent,
} from "react";

type Tool = "paint" | "erase";

interface UseMaskScreenProps {
  imageBase64: string;
  onMaskReady: (canvas: HTMLCanvasElement) => void;
}

export function useMaskScreenHelper({
  imageBase64,
  onMaskReady,
}: UseMaskScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("paint");
  const [brushSize, setBrushSize] = useState(40);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;

      const maxW = container.clientWidth;
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      setCanvasSize({ width: w, height: h });
    };
    img.src = imageBase64;
  }, [imageBase64]);

  useEffect(() => {
    if (canvasSize.width === 0 || canvasSize.height === 0) return;

    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      maskCanvas.width = canvasSize.width;
      maskCanvas.height = canvasSize.height;
      const ctx = maskCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
      }
    }

    const displayCanvas = displayCanvasRef.current;
    if (displayCanvas) {
      displayCanvas.width = canvasSize.width;
      displayCanvas.height = canvasSize.height;
    }
  }, [canvasSize]);

  const syncDisplay = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!displayCanvas || !maskCanvas) return;
    const ctx = displayCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;
    const maskData = maskCtx.getImageData(
      0,
      0,
      maskCanvas.width,
      maskCanvas.height,
    );
    const overlay = ctx.createImageData(
      displayCanvas.width,
      displayCanvas.height,
    );

    for (let i = 0; i < maskData.data.length; i += 4) {
      const brightness = maskData.data[i];
      if (brightness > 30) {
        overlay.data[i] = 16;
        overlay.data[i + 1] = 185;
        overlay.data[i + 2] = 129;
        overlay.data[i + 3] = 128;
      }
    }
    ctx.putImageData(overlay, 0, 0);
  }, []);

  function getPos(
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) {
    const canvas = displayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function draw(x: number, y: number) {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);

    if (tool === "paint") {
      ctx.fillStyle = "#fff";
      ctx.fill();
    } else {
      ctx.fillStyle = "#000";
      ctx.fill();
    }

    syncDisplay();
  }

  function handleStart(
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    draw(x, y);
  }

  function handleMove(
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>,
  ) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    draw(x, y);
  }

  function handleEnd() {
    setIsDrawing(false);
    if (maskCanvasRef.current) {
      onMaskReady(maskCanvasRef.current);
    }
  }

  function clearMask() {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;
    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    syncDisplay();
    onMaskReady(maskCanvas);
  }

  const cursorSize = brushSize;
  const cursorSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${cursorSize}' height='${cursorSize}'%3E%3Ccircle cx='${cursorSize / 2}' cy='${cursorSize / 2}' r='${cursorSize / 2 - 1}' fill='none' stroke='%23059669' stroke-width='2'/%3E%3C/svg%3E") ${cursorSize / 2} ${cursorSize / 2}, crosshair`;

  return {
    containerRef,
    maskCanvasRef,
    displayCanvasRef,
    tool,
    setTool,
    brushSize,
    setBrushSize,
    canvasSize,
    cursorSvg,
    handleStart,
    handleMove,
    handleEnd,
    clearMask,
  };
}
