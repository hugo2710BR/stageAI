"use client";

import { useState } from "react";
import { type DecorStyle } from "./StyleScreen";

interface UseStyleScreenProps {
  onSubmit: (style: DecorStyle, prompt: string) => void;
}

export function useStyleScreenHelper({ onSubmit }: UseStyleScreenProps) {
  const [selected, setSelected] = useState<DecorStyle>("Moderno");
  const [prompt, setPrompt] = useState("");

  function addChip(chip: string) {
    setPrompt((prev) => {
      if (prev.toLowerCase().includes(chip)) return prev;
      return prev ? `${prev}, ${chip}` : chip;
    });
  }

  function handleSubmit() {
    onSubmit(selected, prompt);
  }

  return {
    selected,
    setSelected,
    prompt,
    setPrompt,
    addChip,
    handleSubmit,
  };
}
