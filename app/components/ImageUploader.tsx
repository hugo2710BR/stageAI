"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { fileToBase64, resizeImage } from "../lib/imageUtils";

interface Props {
  onImageReady: (base64: string) => void;
}

export default function ImageUploader({ onImageReady }: Props) {
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

  if (preview) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-auto" />
        </div>
        <p className="text-sm text-gray-500 truncate max-w-xs">{fileName}</p>
        <button
          onClick={handleReplace}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
        >
          Trocar foto
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-colors
          ${isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-300 bg-white hover:border-emerald-400 hover:bg-gray-50"}
        `}
      >
        {loading ? (
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-8m0 0l-3 3m3-3l3 3M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-600 text-sm font-medium">
              Arrasta uma foto ou <span className="text-emerald-600">clica para carregar</span>
            </p>
            <p className="text-xs text-gray-400">JPG ou PNG, max 10MB</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
