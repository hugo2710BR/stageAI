# StageAI — Virtual Home Staging

## O que e este projeto
App Next.js que permite mobilar virtualmente imoveis usando IA.
O utilizador carrega uma foto, pinta a area a mobilar, escolhe um estilo e a IA gera a imagem com mobilia.

## Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **AI API**: Replicate — modelo `stability-ai/stable-diffusion-inpainting`
- **Backend**: NestJS separado (repo stageai-api) na porta 3001
- **Deploy**: Vercel (futuro)

## Estrutura do projeto
```
stageai/
├── CLAUDE.md
├── middleware.ts                         ← proteção de rotas (/ e /staging requerem token)
├── app/
│   ├── page.tsx                          ← re-export LandingScreen (rota / — pública)
│   ├── layout.tsx                        ← layout base
│   ├── globals.css
│   ├── (routes)/
│   │   ├── login/page.tsx                ← rota /login
│   │   ├── register/page.tsx             ← rota /register
│   │   ├── history/page.tsx              ← rota /history
│   │   └── staging/page.tsx              ← rota /staging (app principal)
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
│   │   ├── login/LoginScreen.tsx + login.hook.tsx    ← form login
│   │   └── register/RegisterScreen.tsx + register.hook.tsx ← form register
│   ├── components/
│   │   ├── header/header.tsx + index.ts
│   │   └── progressIndicator/progressIndicator.tsx + index.ts
│   └── lib/
│       ├── api.ts                        ← API client (loginUser, registerUser, createStaging, getStagingHistory, deleteStaging)
│       └── imageUtils.ts                 ← fileToBase64, resizeImage, extractMask
├── .env.local                            ← NEXT_PUBLIC_API_URL (nao commitar)
└── package.json
```

## Padrao de arquitetura
- **MVVM-like**: cada screen tem um ficheiro TSX (visual) e um hook (logica)
- **Screens**: paginas/fluxos completos (home, upload, mask, style, result, login, register)
- **Components**: reutilizaveis (header, progressIndicator)
- **Contexts**: estado global (auth)
- **Lib**: utilitarios puros (api calls, image processing)

## Fluxo da app (4 etapas)
1. **Upload** — carrega foto JPG/PNG (max 10MB, resize para 1024px)
2. **Mascara** — pinta area a mobilar (canvas com brush ajustavel)
3. **Estilo + Prompt** — escolhe estilo + texto livre
4. **Resultado** — slider before/after + download

## Auth
- AuthContext em `app/contexts/authContext.tsx` com token em localStorage
- API client em `app/lib/api.ts` (loginUser, registerUser fazem fetch ao backend)
- Backend auth endpoints: POST /api/auth/register, POST /api/auth/login
- Backend corre em http://localhost:3001 (repo separado: stageai-api)

## Estado atual do desenvolvimento
- Fluxo de 4 etapas funcional e testado ✅
- Login/Register implementados e funcionais ✅
- AuthProvider com verificação de expiração JWT (load + cada 30s) ✅
- Protecao de rotas via middleware.ts ✅
- Token guardado em cookies (js-cookie) ✅
- Staging ligado ao BE com JWT ✅
- Modelo AI: Replicate flux-fill-pro ($0.05/geração) ✅
- Imagens guardadas no Cloudflare R2 (URLs permanentes) ✅
- Histórico de stagings com delete ✅
- Landing page pública em / ✅
- App principal em /staging ✅

## Auth
- AuthContext em `app/contexts/authContext.tsx` com token em cookies (js-cookie)
- Middleware em `middleware.ts` — sem token redireciona para /login
- API client em `app/lib/api.ts` (loginUser, registerUser, createStaging)
- Backend corre em http://localhost:3001 (repo separado: stageai-api)

## Proximos passos
1. Deploy — Vercel (FE) + Railway ou Render (BE + PostgreSQL)
2. Acesso rede local (telemóvel):
   - `.env.local`: `NEXT_PUBLIC_API_URL=http://192.168.1.91:3001/api`
   - `api.ts`: `const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"`
   - `.env` BE: `FRONTEND_URL=http://192.168.1.91:3000`
   - FE: `npm run dev -- --hostname 0.0.0.0`
3. i18n (futuro)

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
```
Depois criar `.env` a partir do `.env.example` e preencher `REPLICATE_API_TOKEN` e `JWT_SECRET`.

## Regras para o agente
- NUNCA expor REPLICATE_API_TOKEN no frontend
- Componentes sao todos "use client"
- Cor primaria: emerald-600
- Hugo e frontend engineer a aprender backend — guiar, explicar, deixa-lo codar
- Mostrar before/after nas alteracoes e explicar como debug walkthrough
- Dar opiniao honesta sobre decisoes
- Sempre que Hugo sugerir algo, dar opiniao honesta como senior engineer antes de concordar ou discordar
- Validar sempre o trabalho de Hugo apos cada passo
- "inicia os motores" = arrancar Docker, BE e FE por ordem
