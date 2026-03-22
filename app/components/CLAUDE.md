# Componentes — StageAI

## Convenções
- Todos os componentes têm `"use client"` no topo
- Props sempre tipadas com interface local
- Nenhum componente faz fetch direto à Replicate — isso é responsabilidade da API Route
- Tailwind para styling — sem CSS modules nem styled-components
- Cor primária: `emerald-600` (#059669) — usar em CTAs, estados ativos, badges de sucesso

## Componentes existentes

### `ImageUploader.tsx`
- **Props**: `onImageReady: (base64: string) => void`
- **Comportamento**: drag & drop + click to upload, valida tipo e tamanho, chama `fileToBase64` + `resizeImage` de `../lib/imageUtils`
- **Estados internos**: `isDragging`, `preview`, `fileName`, `loading`, `error`
- **Não alterar**: a lógica de resize (máx 1024px) é necessária para o Replicate aceitar a imagem

### `MaskCanvas.tsx`
- **Props**: `imageBase64: string`, `onMaskReady: (canvas: HTMLCanvasElement) => void`
- **Comportamento**: renderiza a imagem + canvas overlay, pincel branco sobre fundo preto, suporta touch e mouse
- **Estados internos**: `tool` (paint | erase), `brushSize` (10–120px), `isDrawing`
- **Importante**: usa dois canvas — `maskCanvasRef` (oculto, enviado à API) e `displayCanvasRef` (visível, overlay verde semi-transparente)
- **Cursor**: SVG dinâmico que reflete o tamanho do brush atual

### `StyleSelector.tsx`
- **Props**: `onSubmit: (style: DecorStyle, prompt: string) => void`, `loading: boolean`
- **Tipos**: `DecorStyle = "Moderno" | "Escandinavo" | "Industrial" | "Mediterrâneo"`
- **Comportamento**: grid de 4 cards de estilo + textarea de prompt + chips de sugestão rápida
- **Chips disponíveis**: sofá de couro, mesa de jantar, iluminação quente, plantas decorativas, tapete bege, prateleiras de madeira, espelho grande

### `BeforeAfterSlider.tsx`
- **Props**: `before: string`, `after: string` (ambos base64 ou URL)
- **Comportamento**: slider drag horizontal, clip da imagem "antes" à esquerda do divisor
- **Suporta**: mouse e touch
- **Não usar**: bibliotecas externas — implementado com CSS puro e refs

## Como adicionar um novo componente
1. Criar em `app/components/NomeComponente.tsx`
2. Adicionar `"use client"` no topo
3. Exportar como `default`
4. Documentar aqui neste CLAUDE.md com props e comportamento
