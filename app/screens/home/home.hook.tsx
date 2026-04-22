"use client";

import { useState, useRef, useEffect } from "react";
import { type DecorStyle } from "../style/StyleScreen";
import { extractMask } from "../../lib/imageUtils";
import { useAuth } from "@/app/contexts/authContext";
import { useUsage } from "@/app/contexts/usageContext";
import { createStaging } from "@/app/lib/api";

const STEPS_FREE = ["Upload", "Estilo", "Resultado"] as const;
const STEPS_PAID = ["Upload", "Mascara", "Estilo", "Resultado"] as const;

export function useHomeScreenHelper() {
  const [step, setStep] = useState(1);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [editSourceBase64, setEditSourceBase64] = useState<string | null>(null);
  const [results, setResults] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFreeUser, setIsFreeUser] = useState(false);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastStyleRef = useRef<{ style: string; prompt: string } | null>(null);
  const lastMaskRef = useRef<string | undefined>(undefined);
  const { token } = useAuth();
  const { usage, refreshUsage } = useUsage();

  const resultUrl = results[currentIndex] ?? null;

  useEffect(() => {
    if (usage) setIsFreeUser(usage.plan === "free");
  }, [usage]);

  const STEPS = isFreeUser ? STEPS_FREE : STEPS_PAID;
  const progressStep = isFreeUser
    ? step === 1 ? 1 : step === 3 ? 2 : 3
    : step;

  function handleImageReady(base64: string) {
    setImageBase64(base64);
    setEditSourceBase64(null);
  }

  function handleMaskReady(canvas: HTMLCanvasElement) {
    maskCanvasRef.current = canvas;
  }

  async function handleStyleSubmit(style: DecorStyle, prompt: string) {
    const sourceImage = editSourceBase64 || imageBase64;
    if (!sourceImage) return;
    if (!isFreeUser && !maskCanvasRef.current) return;
    if (!token) {
      setError("Sessão expirada. Faz login novamente.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let mask: string | undefined;

      if (!isFreeUser && maskCanvasRef.current) {
        const ctx = maskCanvasRef.current.getContext("2d");
        if (ctx) {
          const { width, height } = maskCanvasRef.current;
          const pixels = ctx.getImageData(0, 0, width, height).data;
          let white = 0;
          for (let i = 0; i < pixels.length; i += 4) white += pixels[i] > 30 ? 1 : 0;
          const coverage = white / (width * height);
          if (coverage === 0) {
            setError("Pinta primeiro a área que queres mobilar.");
            setLoading(false);
            return;
          }
          if (coverage > 0.9) {
            setError("A área pintada cobre quase toda a imagem. O modelo de IA precisa de contexto — deixa pelo menos uma parte da sala sem pintar.");
            setLoading(false);
            return;
          }
        }

        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.src = sourceImage;
        });
        mask = extractMask(maskCanvasRef.current, img.width, img.height);
      }

      const data = await createStaging(
        token,
        sourceImage,
        mask,
        style,
        prompt,
      );

      if (data.error) {
        setError(data.error);
      } else {
        lastStyleRef.current = { style, prompt };
        lastMaskRef.current = mask;
        setResults([data.result]);
        setCurrentIndex(0);
        setStep(4);
        refreshUsage();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : null;
      setError(
        message && message.includes("Limite")
          ? `${message} Vê os nossos planos em /pricing.`
          : "Erro ao comunicar com a API. Tenta novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleVariation() {
    const sourceImage = editSourceBase64 || imageBase64;
    if (!sourceImage || !token || !lastStyleRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const seed = Math.floor(Math.random() * 1000000);
      const data = await createStaging(
        token,
        sourceImage,
        lastMaskRef.current,
        lastStyleRef.current.style,
        lastStyleRef.current.prompt,
        undefined,
        undefined,
        seed,
      );
      if (data.error) {
        setError(data.error);
      } else {
        setResults((prev) => [...prev, data.result]);
        setCurrentIndex((prev) => prev + 1);
        refreshUsage();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : null;
      setError(
        message && message.includes("Limite")
          ? `${message} Vê os nossos planos em /pricing.`
          : "Erro ao gerar variação. Tenta novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleEditResult() {
    if (!resultUrl || !token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(resultUrl);
      if (!response.ok) throw new Error("Falha ao carregar imagem");
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      setEditSourceBase64(base64);
      maskCanvasRef.current = null;
      setStep(2);
    } catch {
      setError("Erro ao carregar imagem para edição. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!resultUrl) return;
    try {
      const response = await fetch(resultUrl);
      if (!response.ok) throw new Error("Falha ao descarregar imagem");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "stageai-result.jpg";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch {
      setError("Erro ao descarregar a imagem. Tenta novamente.");
    }
  }

  function handleRetryStyle() {
    setResults([]);
    setCurrentIndex(0);
    setError(null);
    setEditSourceBase64(null);
    setStep(3);
  }

  function handleNewImage() {
    setImageBase64(null);
    setEditSourceBase64(null);
    setResults([]);
    setCurrentIndex(0);
    setError(null);
    maskCanvasRef.current = null;
    lastStyleRef.current = null;
    lastMaskRef.current = undefined;
    setStep(1);
  }

  return {
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
  };
}
