"use client";

import UploadScreen from "../upload/UploadScreen";
import MaskScreen from "../mask/MaskScreen";
import StyleScreen from "../style/StyleScreen";
import ResultScreen from "../result/ResultScreen";
import { useHomeScreenHelper } from "./home.hook";
import { Header, ProgressIndicator } from "@/app/components";

export default function HomeScreen() {
  const {
    STEPS,
    step,
    setStep,
    imageBase64,
    resultUrl,
    loading,
    error,
    handleImageReady,
    handleMaskReady,
    handleStyleSubmit,
    handleDownload,
    handleRetryStyle,
    handleNewImage,
  } = useHomeScreenHelper();

  return (
    <main className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <Header />
        {/* Progress indicator */}
        <ProgressIndicator step={step} steps={STEPS}/>
        {/* Step content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          {/* Step 1: Upload */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Carrega uma foto do imovel
              </h2>
              <UploadScreen onImageReady={handleImageReady} />
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
              <MaskScreen
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
              <StyleScreen onSubmit={handleStyleSubmit} loading={loading} />
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
              <ResultScreen before={imageBase64} after={resultUrl} />
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
