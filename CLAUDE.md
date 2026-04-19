# StageAI — Virtual Home Staging

## O que e este projeto
App Next.js que permite mobilar virtualmente imoveis usando IA.
O utilizador carrega uma foto, pinta a area a mobilar, escolhe um estilo e a IA gera a imagem com mobilia.

## Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **AI API**: Fal AI — modelo `fal-ai/flux-pro/v1/fill` (~$0.05/geração)
- **Backend**: NestJS separado (repo stageai-api) na porta 3001
- **Deploy**: Vercel (FE) + Railway (BE + PostgreSQL)

## Estrutura do projeto
```
stageai/
├── CLAUDE.md
├── middleware.ts                         ← proteção de rotas (/ pública, /staging e /history requerem token)
├── app/
│   ├── page.tsx                          ← re-export LandingScreen (rota / — pública)
│   ├── layout.tsx                        ← layout base + AuthProvider
│   ├── globals.css                       ← keyframes: fadeIn, fadeInUp
│   ├── (routes)/
│   │   ├── login/page.tsx                ← rota /login
│   │   ├── register/page.tsx             ← rota /register
│   │   ├── staging/page.tsx              ← rota /staging (app principal)
│   │   ├── history/page.tsx              ← rota /history
│   │   └── pricing/page.tsx              ← rota /pricing
│   ├── contexts/
│   │   └── authContext.tsx               ← AuthProvider (token em cookies, login/register/logout, JWT expiry check)
│   ├── screens/
│   │   ├── landing/LandingScreen.tsx     ← landing page pública
│   │   ├── home/HomeScreen.tsx + home.hook.tsx       ← orquestrador do fluxo 4 etapas
│   │   ├── upload/UploadScreen.tsx + upload.hook.tsx ← step 1: drag & drop upload
│   │   ├── mask/MaskScreen.tsx + mask.hook.tsx       ← step 2: pintar mascara
│   │   ├── style/StyleScreen.tsx + style.hook.tsx    ← step 3: escolher estilo + prompt
│   │   ├── result/ResultScreen.tsx + result.hook.tsx ← step 4: slider before/after
│   │   ├── history/HistoryScreen.tsx + history.hook.tsx ← histórico de stagings
│   │   ├── pricing/PricingScreen.tsx                 ← planos e preços (dados do BE)
│   │   ├── login/LoginScreen.tsx + login.hook.tsx    ← form login
│   │   └── register/RegisterScreen.tsx + register.hook.tsx ← form register
│   ├── components/
│   │   ├── header/header.tsx + index.ts  ← logo, usage counter, botão Upgrade, Histórico, Logout
│   │   └── progressIndicator/progressIndicator.tsx + index.ts
│   └── lib/
│       ├── api.ts                        ← API client
│       └── imageUtils.ts                 ← fileToBase64, resizeImage, extractMask
├── .env.local                            ← NEXT_PUBLIC_API_URL (nao commitar)
└── package.json
```

## Padrao de arquitetura
- **MVVM-like**: cada screen tem um ficheiro TSX (visual) e um hook (logica)
- **Screens**: paginas/fluxos completos (home, upload, mask, style, result, login, register, history, pricing)
- **Components**: reutilizaveis (header, progressIndicator)
- **Contexts**: estado global (auth)
- **Lib**: utilitarios puros (api calls, image processing)

## Fluxo da app (4 etapas)
1. **Upload** — carrega foto JPG/PNG (max 10MB, resize para 1024px)
2. **Mascara** — pinta area a mobilar (canvas com brush ajustavel). Validação: sem máscara ou cobertura >90% bloqueia geração
3. **Estilo + Prompt** — escolhe estilo + texto livre (opcional) + chips de sugestão
4. **Resultado** — slider before/after + download + opções de retry/nova imagem

## Auth
- AuthContext em `app/contexts/authContext.tsx` com token em cookies (js-cookie)
- Middleware em `middleware.ts` — sem token redireciona para /login
- API client em `app/lib/api.ts`
- Backend corre em http://localhost:3001 (repo separado: stageai-api)

## API client (app/lib/api.ts)
| Função | Método | Rota | Auth |
|---|---|---|---|
| `registerUser(email, password, name?)` | POST | `/auth/register` | Não |
| `loginUser(email, password)` | POST | `/auth/login` | Não |
| `createStaging(token, image, mask, style, prompt, w?, h?)` | POST | `/staging` | Sim |
| `getUsage(token)` | GET | `/staging/usage` | Sim |
| `getStagingHistory(token)` | GET | `/staging` | Sim |
| `deleteStaging(token, id)` | DELETE | `/staging/:id` | Sim |
| `getPlans()` | GET | `/plans` | Não |
| `createCheckout(token, planName)` | POST | `/payments/checkout` | Sim |

## Rotas públicas (middleware.ts)
`/`, `/login`, `/register`, `/pricing` — sem token permitido.
`/staging`, `/history` — requerem token JWT.

## Estado atual do desenvolvimento
- Fluxo de 4 etapas funcional ✅
- Login/Register implementados ✅
- AuthProvider com verificação de expiração JWT (load + cada 30s) ✅
- Protecao de rotas via middleware.ts ✅
- Token guardado em cookies (js-cookie) ✅
- Staging ligado ao BE com JWT ✅
- Modelo AI: Fal AI flux-pro/v1/fill (~$0.05/geração) ✅
- Imagens guardadas no Cloudflare R2 (URLs permanentes) ✅
- Histórico de stagings com soft delete ✅
- Landing page pública em / ✅
- App principal em /staging ✅
- Planos dinâmicos via BE (tabela Plan no Postgres) ✅
- Rate limiting por plano (free: 3/mês, starter: 30, pro: 100, agency: ∞) ✅
- Botão Upgrade com gradiente animado no header ✅
- Fade-in em todas as navegações ✅
- Pagamentos via Lemon Squeezy (checkout + webhook) ✅

## Arranque do projeto ("inicia os motores")
Quando Hugo diz "inicia os motores", verificar e arrancar tudo por esta ordem:

1. **Docker Desktop** — tem de estar aberto manualmente no Windows
2. **PostgreSQL**
   ```bash
   cd ~/Desktop/stageai-api
   docker compose up -d
   ```
3. **Backend** (terminal separado)
   ```bash
   cd ~/Desktop/stageai-api
   npm run start:dev
   ```
4. **Frontend** (terminal separado)
   ```bash
   cd ~/Desktop/stageAI
   npm run dev
   ```

### Primeira vez num PC novo
```bash
cd ~/Desktop/stageai-api
npm install
npx prisma@6 generate
npx prisma@6 migrate dev
npx ts-node --transpile-only prisma/seed.ts
```
Depois criar `.env` a partir do `.env.example` e preencher `FAL_KEY`, `JWT_SECRET` e credenciais R2/Cloudflare.

## Regras para o agente
- NUNCA expor FAL_KEY ou credenciais R2 no frontend
- Componentes sao todos "use client"
- Cor primaria: emerald-600
- Hugo e frontend engineer a aprender backend — guiar, explicar, deixa-lo codar
- Mostrar before/after nas alteracoes e explicar como debug walkthrough
- Dar opiniao honesta sobre decisoes
- Sempre que Hugo sugerir algo, dar opiniao honesta como senior engineer antes de concordar ou discordar
- Validar sempre o trabalho de Hugo apos cada passo
- "inicia os motores" = arrancar Docker, BE e FE por ordem
