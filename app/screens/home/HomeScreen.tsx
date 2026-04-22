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
    progressStep,
    isFreeUser,
    imageBase64,
    editSourceBase64,
    resultUrl,
    results,
    currentIndex,
    setCurrentIndex,
    loading,
    error,
    handleImageReady,
    handleMaskReady,
    handleStyleSubmit,
    handleVariation,
    handleEditResult,
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
        <ProgressIndicator step={progressStep} steps={STEPS}/>
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
                    onClick={() => setStep(isFreeUser ? 3 : 2)}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Continuar →
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Step 2: Mask */}
          {step === 2 && (imageBase64 || editSourceBase64) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {editSourceBase64 ? "Pinta a area a re-mobilar" : "Pinta a area a mobilar"}
              </h2>
              <MaskScreen
                imageBase64={(editSourceBase64 || imageBase64)!}
                onMaskReady={handleMaskReady}
              />
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setStep(editSourceBase64 ? 4 : 1)}
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
                  onClick={() => setStep(isFreeUser ? 1 : 2)}
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Resultado</h2>

              {/* Main slider with fade animation on index change */}
              <div key={currentIndex} className="animate-fade-in">
                <ResultScreen before={imageBase64} after={resultUrl} />
              </div>

              {/* Thumbnail strip */}
              {results.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {results.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        i === currentIndex
                          ? "border-emerald-500 shadow-sm scale-105"
                          : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Versão ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              {results.length > 1 && (
                <p className="text-xs text-gray-400 text-center mt-1">
                  Versão {currentIndex + 1} de {results.length}
                </p>
              )}

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={handleVariation}
                  disabled={loading}
                  className="px-6 py-2.5 border border-emerald-200 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50"
                >
                  {loading ? "A gerar..." : "Gerar variação"}
                </button>
                {!isFreeUser && (
                  <button
                    onClick={handleEditResult}
                    disabled={loading}
                    className="px-6 py-2.5 border border-blue-200 text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-colors disabled:opacity-50"
                  >
                    Editar resultado
                  </button>
                )}
                <button
                  onClick={handleRetryStyle}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Outro estilo
                </button>
                <button
                  onClick={handleNewImage}
                  className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Nova imagem
                </button>
              </div>
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
