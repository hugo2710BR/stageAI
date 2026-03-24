"use client";

import { useUploadScreenHelper } from "./upload.hook";

interface Props {
  onImageReady: (base64: string) => void;
}

export default function UploadScreen({ onImageReady }: Props) {
  const {
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
  } = useUploadScreenHelper({ onImageReady });

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
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
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
