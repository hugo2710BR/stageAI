"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  MouseEvent,
  TouchEvent,
} from "react";

interface Props {
  imageBase64: string;
  onMaskReady: (canvas: HTMLCanvasElement) => void;
}

type Tool = "paint" | "erase";

export default function MaskCanvas({ imageBase64, onMaskReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("paint");
  const [brushSize, setBrushSize] = useState(40);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Carrega a imagem e ajusta o tamanho dos canvas
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

      // Configurar mask canvas (oculto)
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        maskCanvas.width = w;
        maskCanvas.height = h;
        const ctx = maskCanvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#000";
          ctx.fillRect(0, 0, w, h);
        }
      }

      // Configurar display canvas
      const displayCanvas = displayCanvasRef.current;
      if (displayCanvas) {
        displayCanvas.width = w;
        displayCanvas.height = h;
      }
    };
    img.src = imageBase64;
  }, [imageBase64]);

  const syncDisplay = useCallback(() => {
    const displayCanvas = displayCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!displayCanvas || !maskCanvas) return;
    const ctx = displayCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, displayCanvas.width, displayCanvas.height);

    // Desenha a mascara como overlay verde semi-transparente
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const overlay = ctx.createImageData(displayCanvas.width, displayCanvas.height);

    for (let i = 0; i < maskData.data.length; i += 4) {
      const brightness = maskData.data[i];
      if (brightness > 30) {
        overlay.data[i] = 16;      // R
        overlay.data[i + 1] = 185;  // G
        overlay.data[i + 2] = 129;  // B
        overlay.data[i + 3] = 128;  // A (50%)
      }
    }
    ctx.putImageData(overlay, 0, 0);
  }, []);

  function getPos(
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) {
    const canvas = displayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
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
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();

      // Re-preencher com preto onde foi apagado
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = maskCanvas.width;
      tempCanvas.height = maskCanvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.fillStyle = "#000";
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.globalCompositeOperation = "destination-in";
        tempCtx.drawImage(maskCanvas, 0, 0);

        // Onde maskCanvas tem pixels, manter; onde nao tem, preto
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        // Re-draw: preencher tudo de preto e depois repor a mascara
        const maskData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
        for (let i = 0; i < maskData.data.length; i += 4) {
          if (maskData.data[i + 3] === 0) {
            maskData.data[i] = 0;
            maskData.data[i + 1] = 0;
            maskData.data[i + 2] = 0;
            maskData.data[i + 3] = 255;
          }
        }
        ctx.putImageData(maskData, 0, 0);
        ctx.restore();
      }
    }

    syncDisplay();
  }

  function handleStart(
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
  ) {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    draw(x, y);
  }

  function handleMove(
    e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>
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

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-3">
        <button
          onClick={() => setTool("paint")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tool === "paint"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pincel
        </button>
        <button
          onClick={() => setTool("erase")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tool === "erase"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Apagar
        </button>
        <button
          onClick={clearMask}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Limpar tudo
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Tamanho:</span>
          <input
            type="range"
            min={10}
            max={120}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 accent-emerald-600"
          />
          <span className="text-xs text-gray-500 w-8">{brushSize}px</span>
        </div>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
        {canvasSize.width > 0 && (
          <div
            className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            style={{ width: canvasSize.width, height: canvasSize.height }}
          >
            {/* Imagem de fundo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageBase64}
              alt="Imagem original"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Mask canvas (oculto) */}
            <canvas
              ref={maskCanvasRef}
              className="hidden"
            />

            {/* Display canvas (overlay interativo) */}
            <canvas
              ref={displayCanvasRef}
              className="absolute inset-0 touch-none"
              style={{ cursor: cursorSvg }}
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Pinta a verde a area onde queres adicionar mobilia
      </p>
    </div>
  );
}
