"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { fileToBase64, resizeImage } from "../../lib/imageUtils";

interface UseUploadScreenProps {
  onImageReady: (base64: string) => void;
}

export function useUploadScreenHelper({ onImageReady }: UseUploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Por favor carrega uma imagem (JPG ou PNG).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("A imagem excede o limite de 10MB.");
      return;
    }

    setLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const resized = await resizeImage(base64);
      setPreview(resized);
      setFileName(file.name);
      onImageReady(resized);
    } catch {
      setError("Erro ao processar a imagem. Tenta novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleReplace() {
    setPreview(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  return {
    isDragging,
    preview,
    fileName,
    loading,
    error,
    inputRef,
    handleDrop,
    handleChange,
    handleReplace,
    handleDragOver,
    handleDragLeave,
    handleClick,
  };
}
