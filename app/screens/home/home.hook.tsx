"use client";

import { useState, useRef } from "react";
import { type DecorStyle } from "../style/StyleScreen";
import { extractMask } from "../../lib/imageUtils";

const STEPS = ["Upload", "Mascara", "Estilo", "Resultado"] as const;

export function useHomeScreenHelper() {
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

  async function handleDownload() {
    if (!resultUrl) return;
    const response = await fetch(resultUrl);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "stageai-result.jpg";
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(blobUrl);
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

  return {
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
  };
}
