# StageAI — Product Backlog

> Ultima atualizacao: 2026-04-22

---

## Concluido ✅

### FEAT-001: Rate limiting + planos
- **Estado:** Concluido ✅
- **O que foi feito:**
  - Campo `plan` no User (free | starter | pro | agency)
  - Tabela `Plan` no Postgres com limites dinâmicos (sem hardcode)
  - GET /staging/usage devolve { plan, used, limit, remaining }
  - Reset automatico mensal por `createdAt`
  - `planUpgradedAt` — ao fazer upgrade, contador recomeça do zero
  - Soft delete — apagar staging nao repoe creditos
  - Botao Upgrade no header (aparece quando remaining === 0, plano != agency)
  - Pricing page dinamica com dados do BE

### FEAT-004: Pagamentos (Lemon Squeezy, nao Stripe)
- **Estado:** Concluido ✅
- **O que foi feito:**
  - PaymentsModule — POST /payments/checkout + POST /payments/webhook
  - Checkout cria sessao LS com user_id em custom_data
  - Webhook valida HMAC-SHA256 com raw body, atualiza User.plan
  - Webhook configurado no dashboard LS e env vars no Railway
  - Ver DEC-003 para detalhes

---

## P1 — Critico

### FEAT-NEW-001: Diferenciacao free vs pago — remover masking do plano free
- **Prioridade:** P1
- **Impacto:** Alto (produto + receita)
- **Esforco:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Plano free usa modelo sem inpainting (ex: flux/schnell) e nao tem step de mascara. Starter+ usa flux-pro/v1/fill com masking completo. Ver DEC-007.
- **Criterios de aceitacao:**
  - Free: fluxo Upload → Estilo → Gerar (3 steps)
  - Starter+: fluxo Upload → Mascara → Estilo → Gerar (4 steps)
  - Modelo diferente chamado conforme plano do user
  - Pricing page comunica claramente a diferenca
- **Ficheiros FE afetados:**
  - `app/screens/home/home.hook.tsx` — skip step de mascara se plano free
  - `app/screens/pricing/PricingScreen.tsx` — comunicar "masking" como feature paga
- **Ficheiros BE afetados:**
  - `src/fal/fal.service.ts` — suportar modelo alternativo sem inpainting
  - `src/staging/staging.service.ts` — escolher modelo conforme user.plan
  - `src/staging/dto/create-staging.dto.ts` — campo mask opcional
- **A decidir:** modelo free (flux/schnell vs flux/dev) e custo por geracao

---

## P1 — Importantes (a fazer)

### FEAT-002: Galeria before/after na landing
- **Prioridade:** P1
- **Impacto:** Alto
- **Esforco:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE
- **Descricao:** Mostrar 3-4 exemplos reais de before/after na landing page. Converte visitantes em utilizadores.
- **Criterios de aceitacao:**
  - Minimo 3 exemplos com slider before/after
  - Imagens reais geradas pelo StageAI
  - Responsivo
- **Ficheiros FE afetados:**
  - `app/screens/landing/LandingScreen.tsx`
  - `public/examples/` — imagens estaticas

### FEAT-003: Variacoes no resultado
- **Prioridade:** P1
- **Impacto:** Alto
- **Esforco:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Botao "Gerar variacao" reutiliza imagem + mascara com seed diferente.
- **Ficheiros FE afetados:**
  - `app/screens/result/ResultScreen.tsx`
  - `app/screens/home/home.hook.tsx`
- **Ficheiros BE afetados:**
  - `src/fal/fal.service.ts` — seed opcional
  - `src/staging/dto/create-staging.dto.ts` — campo seed opcional

---

## P2 — Importante

### FEAT-NEW-002: Pagina de conta (/account)
- **Prioridade:** P2
- **Impacto:** Alto
- **Esforco:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Pagina autenticada com dados pessoais, plano atual, uso do mes e opcao de eliminar conta.
- **Criterios de aceitacao:**
  - Ver nome, email, plano atual, data de upgrade, remaining/mes
  - Editar nome
  - Eliminar conta: apaga todos os ficheiros R2, hard delete User no Postgres, logout automatico
  - Confirmacao obrigatoria antes de eliminar (escrever "DELETE" ou password)
- **Ficheiros FE afetados:**
  - `app/(routes)/account/page.tsx` — nova rota
  - `app/screens/account/AccountScreen.tsx` — nova screen
  - `app/lib/api.ts` — getAccount(), updateAccount(), deleteAccount()
- **Ficheiros BE afetados:**
  - `src/account/` — novo modulo
  - GET /account, PATCH /account, DELETE /account
  - DELETE apaga todos os stagings R2 antes de apagar User
- **Notas tecnicas:** Apagar R2 antes de DB. Se R2 falhar a meio, tentar continuar (partial cleanup). Hard delete do User em cascata apaga Stagings via Prisma.

### FEAT-005: Partilha publica por link (/share/{id})
- **Prioridade:** P2
- **Impacto:** Alto
- **Esforco:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** URL publica para partilhar resultado. Agentes imobiliarios partilham com clientes.
- **Ficheiros FE afetados:**
  - `app/(routes)/share/[id]/page.tsx`
  - `app/screens/share/ShareScreen.tsx`
  - `app/screens/result/ResultScreen.tsx` — botao partilhar
  - `app/screens/history/HistoryScreen.tsx` — botao partilhar
  - `app/lib/api.ts` — getPublicStaging(id)
- **Ficheiros BE afetados:**
  - `src/staging/staging.controller.ts` — GET /staging/share/:id (sem auth)
  - `src/staging/staging.service.ts` — findPublicById()
  - `prisma/schema.prisma` — campo isPublic Boolean default false

### FEAT-006: Exportacao PDF com branding
- **Prioridade:** P2
- **Impacto:** Medio
- **Esforco:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE
- **Descricao:** PDF profissional com logo, before/after, estilo, data.
- **Abordagem recomendada:** Frontend com jsPDF/html2canvas (evita Puppeteer no Railway)
- **Ficheiros FE afetados:**
  - `app/screens/result/ResultScreen.tsx` — botao PDF
  - `app/lib/pdfExport.ts` — novo utilitario

---

## P3 — Nice to have

### FEAT-010: Onboarding guiado (tour primeira visita)
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforco:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE
- **Descricao:** Tour interativo na primeira visita. Flag em localStorage.
- **Ficheiros FE afetados:**
  - `app/screens/home/HomeScreen.tsx`
  - `app/screens/home/home.hook.tsx`
  - Opcional: `app/components/tour/`
- **Notas tecnicas:** localStorage flag `onboarding_completed`. Pode usar react-joyride.

### FEAT-007: Estilos custom guardados
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforco:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Criar, guardar e reutilizar estilos personalizados (prompt).
- **Ficheiros afetados:**
  - `app/screens/style/StyleScreen.tsx + style.hook.tsx`
  - `app/lib/api.ts`
  - `prisma/schema.prisma` — model CustomStyle
  - `src/staging/` — CRUD endpoints

### FEAT-008: Multiplos estilos em paralelo
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforco:** Alto
- **Estado:** Todo
- **Notas tecnicas:** Cuidado com custos — 4 estilos = $0.20. Limitar a planos pagos.

### FEAT-009: Auto-detecao de mascara (SAM)
- **Prioridade:** P3
- **Impacto:** Alto
- **Esforco:** Alto
- **Estado:** Todo
- **Notas tecnicas:** Investigar Segment Anything Model no Fal AI. Feature premium.

### FEAT-011: Comparacao side-by-side do historico
- **Prioridade:** P3
- **Esforco:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE apenas

### FEAT-012: Favoritos no historico
- **Prioridade:** P3
- **Esforco:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE + BE (campo isFavorite no Staging)

### FEAT-013: Undo/Redo na mascara
- **Prioridade:** P3
- **Esforco:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE apenas
- **Notas tecnicas:** Stack de ImageData, maximo 20 estados.

---

## P4 — Futuro

### FEAT-014: Dashboard com metricas de uso
### FEAT-015: Integracao com portais imobiliarios (Idealista, Imovirtual)
### FEAT-016: Video / walkthrough (image-to-video Fal AI)
- **Notas tecnicas:** Modelos de video em evolucao rapida. Reavaliar em 2-3 meses. Guardar no R2 tal como imagens. Contar como geracao separada. Feature starter+ minimo.
