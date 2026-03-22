# StageAI — Virtual Home Staging

## O que é este projeto
App Next.js que permite mobilar virtualmente imóveis usando IA.
O utilizador carrega uma foto, pinta a área a mobilar, escolhe um estilo e a IA gera a imagem com mobília.

## Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **AI API**: Replicate — modelo `stability-ai/stable-diffusion-inpainting`
- **Deploy**: Vercel

## Estrutura do projeto
```
stageai/
├── CLAUDE.md                        ← contexto global (este ficheiro)
├── app/
│   ├── page.tsx                     ← página principal, fluxo 4 etapas
│   ├── layout.tsx                   ← layout base
│   ├── globals.css
│   ├── api/
│   │   └── stage/
│   │       └── route.ts             ← backend proxy → Replicate API
│   ├── components/
│   │   ├── CLAUDE.md                ← contexto dos componentes
│   │   ├── ImageUploader.tsx
│   │   ├── MaskCanvas.tsx
│   │   ├── StyleSelector.tsx
│   │   └── BeforeAfterSlider.tsx
│   └── lib/
│       ├── CLAUDE.md                ← contexto dos utilitários
│       └── imageUtils.ts
├── .env.local                       ← REPLICATE_API_TOKEN (não commitar)
└── package.json
```

## Variáveis de ambiente obrigatórias
```
REPLICATE_API_TOKEN=r8_...
```
Criar conta em https://replicate.com → Settings → API Tokens → Free credits ao criar conta.

## Fluxo da app (4 etapas)
1. **Upload** — utilizador carrega foto JPG/PNG (máx 10MB, resize automático para 1024px)
2. **Máscara** — pinta sobre a imagem a área a mobilar (canvas com brush ajustável)
3. **Estilo + Prompt** — escolhe estilo (Moderno/Escandinavo/Industrial/Mediterrâneo) + texto livre
4. **Resultado** — slider before/after interativo + botão download

## Regras gerais para o agente
- NUNCA expor `REPLICATE_API_TOKEN` no frontend
- Todo o acesso à Replicate API passa pela API Route `/api/stage`
- Imagens são sempre convertidas para base64 antes de enviar
- A máscara é gerada no canvas e convertida para PNG base64 (branco = área a gerar)
- Negative prompt sempre incluído para evitar resultados de baixa qualidade
- Componentes são todos `"use client"` — não há Server Components nos componentes de UI
