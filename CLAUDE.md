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
├── app/
│   ├── page.tsx                          ← re-export HomeScreen
│   ├── layout.tsx                        ← layout base
│   ├── globals.css
│   ├── login/page.tsx                    ← rota /login
│   ├── register/page.tsx                 ← rota /register
│   ├── api/stage/route.ts               ← proxy Replicate (a ser substituido pelo backend)
│   ├── contexts/
│   │   └── authContext.tsx               ← AuthProvider (token em localStorage, login/register/logout)
│   ├── screens/
│   │   ├── home/HomeScreen.tsx + home.hook.tsx       ← orquestrador do fluxo 4 etapas
│   │   ├── upload/UploadScreen.tsx + upload.hook.tsx ← step 1: drag & drop upload
│   │   ├── mask/MaskScreen.tsx + mask.hook.tsx       ← step 2: pintar mascara
│   │   ├── style/StyleScreen.tsx + style.hook.tsx    ← step 3: escolher estilo + prompt
│   │   ├── result/ResultScreen.tsx + result.hook.tsx ← step 4: slider before/after
│   │   ├── login/LoginScreen.tsx + login.hook.tsx    ← form login
│   │   └── register/RegisterScreen.tsx + register.hook.tsx ← form register
│   ├── components/
│   │   ├── header/header.tsx + index.ts
│   │   └── progressIndicator/progressIndicator.tsx + index.ts
│   └── lib/
│       ├── api.ts                        ← API client (loginUser, registerUser)
│       └── imageUtils.ts                 ← fileToBase64, resizeImage, extractMask
├── .env.local                            ← REPLICATE_API_TOKEN (nao commitar)
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
- Fluxo de 4 etapas funcional e testado
- Login/Register: visual criado, hooks por preencher (login.hook.tsx e register.hook.tsx)
- AuthProvider ainda nao adicionado ao layout.tsx
- Protecao de rotas nao implementada (sem token → redirecionar para /login)
- API Route /api/stage sera substituida por chamadas ao backend

## Proximos passos
1. Preencher login.hook.tsx e register.hook.tsx (Hugo faz)
2. Adicionar AuthProvider ao layout.tsx
3. Proteger rotas (sem token → /login)
4. Conectar staging ao backend (substituir /api/stage)
5. i18n (futuro)

## Regras para o agente
- NUNCA expor REPLICATE_API_TOKEN no frontend
- Componentes sao todos "use client"
- Cor primaria: emerald-600
- Hugo e frontend engineer a aprender backend — guiar, explicar, deixa-lo codar
- Mostrar before/after nas alteracoes e explicar como debug walkthrough
- Dar opiniao honesta sobre decisoes
