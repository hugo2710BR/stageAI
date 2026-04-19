# screens

## Objetivo
Ecrãs completos da app — cada subpasta é uma unidade de UI com a sua lógica isolada.

## Padrão obrigatório: Screen + Hook
Cada screen tem dois ficheiros:
- `XxxScreen.tsx` — JSX + layout próprio (inclui `<Header />` quando necessário). Zero lógica de negócio.
- `xxx.hook.tsx` — `useState`, `useEffect`, chamadas à `api.ts`, derivações de estado

```
screens/home/
├── HomeScreen.tsx    ← UI
└── home.hook.tsx     ← lógica
```

Excepção: screens estáticas sem estado (ex: `LandingScreen.tsx`) podem não ter hook.

## Regras
- `"use client"` em todos os ficheiros
- Um screen não importa outro screen diretamente — comunicação via contexto ou props
- Componentes reutilizáveis saem daqui e vão para `app/components/`
- Sem chamadas diretas à `api.ts` dentro do TSX — isso fica no hook

## Screens existentes

| Pasta | Screen | Rota | Descrição |
|---|---|---|---|
| `landing/` | `LandingScreen.tsx` | `/` | Landing page pública. Sem hook. |
| `home/` | `HomeScreen.tsx` | `/staging` | Orquestrador do fluxo 4 etapas. Gere step, imagem, máscara, resultado. |
| `upload/` | `UploadScreen.tsx` | — | Step 1: drag & drop upload de imagem JPG/PNG |
| `mask/` | `MaskScreen.tsx` | — | Step 2: canvas de pintura da máscara com brush ajustável |
| `style/` | `StyleScreen.tsx` | — | Step 3: escolha de estilo + prompt livre + chips de sugestão |
| `result/` | `ResultScreen.tsx` | — | Step 4: slider before/after + download |
| `login/` | `LoginScreen.tsx` | `/login` | Formulário de login |
| `register/` | `RegisterScreen.tsx` | `/register` | Formulário de registo |
| `history/` | `HistoryScreen.tsx` | `/history` | Grelha de stagings anteriores com delete |
| `pricing/` | `PricingScreen.tsx` | `/pricing` | Planos e preços (dinâmico via BE). Sem hook. |

## Fluxo dos steps (home → upload → mask → style → result)
Os steps `upload`, `mask`, `style` e `result` são montados dentro do `HomeScreen` com base no estado `step` do `home.hook`.
Não têm rota própria — o URL mantém-se `/staging` durante todo o fluxo.
