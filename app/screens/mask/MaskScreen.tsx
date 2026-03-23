"use client";

import { useMaskScreenHelper } from "./mask.hook";

interface Props {
  imageBase64: string;
  onMaskReady: (canvas: HTMLCanvasElement) => void;
}

export default function MaskScreen({ imageBase64, onMaskReady }: Props) {
  const {
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
  } = useMaskScreenHelper({ imageBase64, onMaskReady });

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageBase64}
              alt="Imagem original"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <canvas ref={maskCanvasRef} className="hidden" />

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
