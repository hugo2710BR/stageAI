"use client";

import { useState, useRef } from "react";
import ImageUploader from "./components/ImageUploader";
import MaskCanvas from "./components/MaskCanvas";
import StyleSelector, { type DecorStyle } from "./components/StyleSelector";
import BeforeAfterSlider from "./components/BeforeAfterSlider";
import { extractMask } from "./lib/imageUtils";

const STEPS = ["Upload", "Mascara", "Estilo", "Resultado"];

export default function Home() {
  const [step, setStep] = useState(1);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);

  function handleImageReady(base64: string) {
    setImageBase64(base64);
  }

  function handleMaskReady(canvas: HTMLCanvasElement) {
    maskCanvasRef.current = canvas;
  }

  async function handleStyleSubmit(style: DecorStyle, prompt: string) {
    if (!imageBase64 || !maskCanvasRef.current) return;

    setLoading(true);
    setError(null);

    try {
      // Extrair dimensoes da imagem
      const img = new Image();
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.src = imageBase64;
      });

      const mask = extractMask(maskCanvasRef.current, img.width, img.height);

      const res = await fetch("/api/stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64, mask, style, prompt }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResultUrl(data.result);
        setStep(4);
      }
    } catch {
      setError("Erro ao comunicar com a API. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "stageai-result.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleRetryStyle() {
    setResultUrl(null);
    setError(null);
    setStep(3);
  }

  function handleNewImage() {
    setImageBase64(null);
    setResultUrl(null);
    setError(null);
    maskCanvasRef.current = null;
    setStep(1);
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Stage<span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Virtual home staging com inteligencia artificial
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;

            return (
              <div key={label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isCompleted
                        ? "bg-emerald-600 text-white"
                        : isActive
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? "✓" : stepNum}
                  </div>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      isActive ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${
                      isCompleted ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Carrega uma foto do imovel
              </h2>
              <ImageUploader onImageReady={handleImageReady} />
              {imageBase64 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Mask */}
          {step === 2 && imageBase64 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Pinta a area a mobilar
              </h2>
              <MaskCanvas
                imageBase64={imageBase64}
                onMaskReady={handleMaskReady}
              />
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Escolhe o estilo
              </h2>
              <StyleSelector onSubmit={handleStyleSubmit} loading={loading} />
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="mt-4">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
                >
                  ← Voltar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && resultUrl && imageBase64 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Resultado
              </h2>
              <BeforeAfterSlider before={imageBase64} after={resultUrl} />
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={handleRetryStyle}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Tentar outro estilo
                </button>
                <button
                  onClick={handleNewImage}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Nova imagem
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
