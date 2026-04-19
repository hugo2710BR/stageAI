# StageAI — Product Backlog

> Ultima atualizacao: 2026-04-18

---

## P1 — Critico (Semana 1-2)

### FEAT-001: Rate limiting + planos (3 gerações gratuitas/mês)
- **Prioridade:** P1
- **Impacto:** Alto
- **Esforço:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Limitar utilizadores gratuitos a 3 geracoes/mes. Sem isto, qualquer utilizador pode gerar ilimitadamente a $0.05/geracao — risco financeiro real. Inclui pagina de planos (UI) e contagem de uso no backend.
- **Criterios de aceitacao:**
  - Utilizador gratuito bloqueado apos 3 geracoes/mes
  - Contador visivel no header ou antes de gerar
  - Pagina /pricing com planos (Gratuito, Starter, Pro, Agency)
  - Reset automatico no inicio de cada mes
  - Mensagem clara quando atinge o limite com CTA para upgrade
- **Ficheiros FE afetados:**
  - `app/screens/home/home.hook.tsx` — verificar limite antes de chamar API
  - `app/screens/home/HomeScreen.tsx` — mostrar contador de geracoes restantes
  - `app/(routes)/pricing/page.tsx` — nova pagina de planos
  - `app/screens/pricing/PricingScreen.tsx` — nova screen
  - `app/lib/api.ts` — nova funcao `getUsage(token)`
  - `app/components/header/header.tsx` — mostrar geracoes restantes
- **Ficheiros BE afetados:**
  - `prisma/schema.prisma` — campo `plan` no User, model `Usage`
  - `src/staging/staging.service.ts` — verificar limite antes de processar
  - `src/staging/staging.controller.ts` — novo endpoint GET /staging/usage
  - Nova migration Prisma
- **Notas tecnicas:** Contar por `createdAt` do mes corrente em vez de campo separado. Guard ou interceptor no BE para rejeitar com 429. Considerar campo `plan` como enum: free | starter | pro | agency.

---

### FEAT-002: Galeria before/after na landing
- **Prioridade:** P1
- **Impacto:** Alto
- **Esforço:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE
- **Descricao:** Mostrar 3-4 exemplos reais de before/after na landing page. Demonstra o valor do produto antes do registo. Converte visitantes em utilizadores.
- **Criterios de aceitacao:**
  - Minimo 3 exemplos com slider before/after
  - Imagens reais geradas pelo StageAI (nao stock)
  - Seccao visivel sem scroll excessivo (acima do fold ou logo abaixo)
  - Responsivo (mobile e desktop)
- **Ficheiros FE afetados:**
  - `app/screens/landing/LandingScreen.tsx` — nova seccao com galeria
  - `public/examples/` — imagens de exemplo (before + after)
- **Ficheiros BE afetados:** Nenhum
- **Notas tecnicas:** Reutilizar o componente de slider do ResultScreen ou criar versao simplificada. Imagens estaticas em `public/` para evitar chamadas API.

---

### FEAT-003: Variacoes no resultado (gerar outra versao)
- **Prioridade:** P1
- **Impacto:** Alto
- **Esforço:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Apos gerar um resultado, botao "Gerar variacao" reutiliza a mesma imagem + mascara com prompt ligeiramente diferente ou seed diferente. Evita repetir upload e mascara — reduz friccao.
- **Criterios de aceitacao:**
  - Botao "Gerar variacao" visivel no step 4 (resultado)
  - Reutiliza imagem e mascara do step atual
  - Nova geracao com resultado diferente
  - Ambos os resultados acessiveis (antes e depois da variacao)
  - Conta como geracao para efeitos de rate limiting
- **Ficheiros FE afetados:**
  - `app/screens/result/ResultScreen.tsx` — botao "Gerar variacao"
  - `app/screens/home/home.hook.tsx` — funcao handleVariation que reenvia com mesmos dados
- **Ficheiros BE afetados:**
  - `src/fal/fal.service.ts` — aceitar seed opcional para variacoes
  - `src/staging/dto/create-staging.dto.ts` — campo seed opcional
- **Notas tecnicas:** No Fal AI, variar o seed gera resultados diferentes com o mesmo prompt. Alternativa: adicionar ", variation" ao prompt.

---

## P2 — Importante (Semana 3-4)

### FEAT-004: Integracao Stripe (pay-per-use + subscricao)
- **Prioridade:** P2
- **Impacto:** Alto
- **Esforço:** Alto
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Monetizacao real. Planos mensais (Starter €12, Pro €29, Agency €79) + pacotes avulso (10 creditos por €6). Stripe Checkout para pagamento, webhooks para atualizar plano.
- **Criterios de aceitacao:**
  - Checkout funcional com Stripe para cada plano
  - Webhook processa payment_intent.succeeded e atualiza plano do user
  - Cancelamento de subscricao funcional
  - Portal do cliente Stripe para gerir pagamento
  - Creditos adicionais compraveis como pacote avulso
- **Ficheiros FE afetados:**
  - `app/(routes)/pricing/page.tsx` — botoes de compra ligados ao Stripe
  - `app/screens/pricing/PricingScreen.tsx` — UI dos planos com precos
  - `app/lib/api.ts` — `createCheckoutSession(token, plan)`
  - `app/(routes)/checkout/success/page.tsx` — pagina pos-pagamento
- **Ficheiros BE afetados:**
  - `src/billing/` — novo modulo completo (service, controller, module, DTOs)
  - `src/billing/billing.service.ts` — criar sessao Stripe, processar webhooks
  - `src/billing/billing.controller.ts` — POST /checkout, POST /webhook
  - `prisma/schema.prisma` — campos stripeCustomerId, plan, creditsRemaining no User
  - Nova migration Prisma
- **Notas tecnicas:** Usar Stripe Checkout (hosted) para simplificar PCI compliance. Webhook deve ser idempotente. Considerar Stripe Customer Portal para self-service.

---

### FEAT-005: Partilha publica por link (/share/{id})
- **Prioridade:** P2
- **Impacto:** Alto
- **Esforço:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Gerar URL publica para um staging (ex: stageai.com/share/{id}). Agentes imobiliarios podem partilhar com clientes. Imagem ja esta no R2 — so falta rota publica.
- **Criterios de aceitacao:**
  - Botao "Partilhar" no resultado e no historico
  - Link copiado para clipboard com feedback visual
  - Pagina publica mostra imagem resultado + estilo + branding StageAI
  - Nao requer autenticacao para ver
  - Open Graph meta tags para preview em redes sociais
- **Ficheiros FE afetados:**
  - `app/(routes)/share/[id]/page.tsx` — nova pagina publica
  - `app/screens/share/ShareScreen.tsx` — nova screen
  - `app/screens/result/ResultScreen.tsx` — botao partilhar
  - `app/screens/history/historyScreen.tsx` — botao partilhar
  - `app/lib/api.ts` — `getPublicStaging(id)` (sem token)
- **Ficheiros BE afetados:**
  - `src/staging/staging.controller.ts` — GET /staging/share/:id (sem auth)
  - `src/staging/staging.service.ts` — `findPublicById(id)`
  - `prisma/schema.prisma` — campo `isPublic` no Staging (default false)
- **Notas tecnicas:** Considerar campo `isPublic` toggle em vez de tornar todos publicos. Meta tags OG para preview bonito no WhatsApp/LinkedIn.

---

### FEAT-006: Exportacao PDF com branding
- **Prioridade:** P2
- **Impacto:** Medio
- **Esforço:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Exportar resultado como PDF profissional com logo StageAI, before/after lado a lado, estilo aplicado, e data. Para agentes imobiliarios apresentarem a clientes.
- **Criterios de aceitacao:**
  - Botao "Exportar PDF" no resultado e historico
  - PDF contem: logo, before/after, estilo, prompt, data
  - Layout profissional A4
  - Download automatico
- **Ficheiros FE afetados:**
  - `app/screens/result/ResultScreen.tsx` — botao PDF
  - `app/lib/pdfExport.ts` — novo utilitario de geracao PDF
- **Ficheiros BE afetados:**
  - Alternativa server-side: `src/staging/staging.controller.ts` — GET /staging/:id/pdf
  - Dependencia: puppeteer ou @react-pdf/renderer
- **Notas tecnicas:** Duas opcoes: (A) gerar no frontend com jsPDF/html2canvas (mais simples), (B) gerar no backend com Puppeteer (mais controlo). Recomendo A para comecar.

---

## P3 — Nice to have (Semana 5-6)

### FEAT-007: Estilos custom guardados
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforço:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Permitir ao utilizador criar estilos personalizados com prompt guardado e reutilizar. Power users que fazem staging regularmente beneficiam.
- **Criterios de aceitacao:**
  - Botao "Guardar como estilo" apos escrever prompt
  - Lista de estilos custom no step 3 (alem dos 4 default)
  - Editar e apagar estilos custom
  - Maximo 10 estilos custom por utilizador
- **Ficheiros FE afetados:**
  - `app/screens/style/StyleScreen.tsx` — seccao "Os meus estilos"
  - `app/screens/style/style.hook.tsx` — CRUD estilos
  - `app/lib/api.ts` — `getCustomStyles()`, `createCustomStyle()`, `deleteCustomStyle()`
- **Ficheiros BE afetados:**
  - `prisma/schema.prisma` — model CustomStyle (name, prompt, userId)
  - `src/staging/staging.controller.ts` — CRUD endpoints para custom styles
  - `src/staging/staging.service.ts` — logica CRUD
- **Notas tecnicas:** Pode ser sub-recurso de staging ou modulo separado. Guardar apenas o prompt — o estilo e composto por prompt base + prompt do utilizador.

---

### FEAT-008: Multiplos estilos em paralelo
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforço:** Alto
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Gerar a mesma imagem com 2-4 estilos diferentes em paralelo. Mostra resultados lado a lado para comparacao rapida.
- **Criterios de aceitacao:**
  - Selecionar multiplos estilos no step 3
  - Geracoes em paralelo no backend
  - Resultados mostrados em grid comparativo
  - Cada geracao conta para o limite
- **Ficheiros FE afetados:**
  - `app/screens/style/StyleScreen.tsx` — selecao multipla
  - `app/screens/result/ResultScreen.tsx` — grid de resultados
  - `app/screens/home/home.hook.tsx` — gestao de multiplos resultados
- **Ficheiros BE afetados:**
  - `src/staging/staging.controller.ts` — aceitar array de estilos
  - `src/staging/staging.service.ts` — Promise.all para geracoes paralelas
- **Notas tecnicas:** Cuidado com custos — 4 estilos = 4x $0.05 = $0.20. Limitar a planos pagos.

---

### FEAT-009: Modo "mobilar tudo" sem mascara manual
- **Prioridade:** P3
- **Impacto:** Alto
- **Esforço:** Alto
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Detecao automatica de areas vazias na foto usando modelo de segmentacao. Utilizador nao precisa de pintar mascara manualmente — a IA detecta o chao, paredes e areas mobilaveis.
- **Criterios de aceitacao:**
  - Botao "Auto-detectar" no step 2 (mascara)
  - Mascara gerada automaticamente sobre areas mobilaveis
  - Utilizador pode refinar manualmente apos auto-detecao
  - Fallback para mascara manual se detecao falhar
- **Ficheiros FE afetados:**
  - `app/screens/mask/MaskScreen.tsx` — botao auto-detectar
  - `app/screens/mask/mask.hook.tsx` — chamar API de segmentacao
  - `app/lib/api.ts` — `autoDetectMask(token, image)`
- **Ficheiros BE afetados:**
  - `src/staging/staging.controller.ts` — POST /staging/auto-mask
  - `src/staging/staging.service.ts` — chamar modelo de segmentacao
  - Dependencia: modelo de segmentacao (SAM ou similar no Fal/Replicate)
- **Notas tecnicas:** Investigar Segment Anything Model (SAM) no Fal AI. Custo adicional por geracao. Pode ser feature premium.

---

### FEAT-010: Onboarding guiado (tour primeira visita)
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforço:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE
- **Descricao:** Tour interativo na primeira visita ao /staging que explica cada etapa. Reduz abandono de novos utilizadores que nao sabem como usar a ferramenta.
- **Criterios de aceitacao:**
  - Tour aparece apenas na primeira visita (flag em localStorage)
  - Tooltips em cada step explicando o que fazer
  - Botao "Pular" para utilizadores impacientes
  - Nao reaparece apos completar ou pular
- **Ficheiros FE afetados:**
  - `app/screens/home/HomeScreen.tsx` — overlay de onboarding
  - `app/screens/home/home.hook.tsx` — estado do tour
  - Opcional: `app/components/tour/` — componente reutilizavel
- **Ficheiros BE afetados:** Nenhum
- **Notas tecnicas:** Pode ser simples com tooltips CSS ou usar lib como `react-joyride`. localStorage flag `onboarding_completed`.

---

### FEAT-011: Comparacao side-by-side do historico
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforço:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE
- **Descricao:** Selecionar 2-3 stagings do historico e ver lado a lado para comparar estilos diferentes aplicados a mesma divisao.
- **Criterios de aceitacao:**
  - Checkbox de selecao em cada card do historico
  - Botao "Comparar" ativo quando 2-3 selecionados
  - Pagina/modal com imagens lado a lado
  - Indicacao do estilo em cada imagem
- **Ficheiros FE afetados:**
  - `app/screens/history/historyScreen.tsx` — checkboxes + botao comparar
  - `app/screens/history/history.hook.tsx` — estado de selecao
  - `app/(routes)/compare/page.tsx` — nova pagina
  - `app/screens/compare/CompareScreen.tsx` — nova screen
- **Ficheiros BE afetados:** Nenhum
- **Notas tecnicas:** Dados ja disponiveis via GET /staging. Apenas logica de UI.

---

### FEAT-012: Favoritos no historico
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforço:** Baixo
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Marcar stagings como favorito. Filtrar por favoritos no historico. Util quando o utilizador gera muitas variacoes.
- **Criterios de aceitacao:**
  - Icone de coracao/estrela em cada card do historico
  - Toggle favorito com feedback visual imediato
  - Filtro "Apenas favoritos" no historico
  - Estado persistido na base de dados
- **Ficheiros FE afetados:**
  - `app/screens/history/historyScreen.tsx` — icone favorito + filtro
  - `app/screens/history/history.hook.tsx` — toggle + filtro state
  - `app/lib/api.ts` — `toggleFavorite(token, id)`
- **Ficheiros BE afetados:**
  - `prisma/schema.prisma` — campo `isFavorite` Boolean default false no Staging
  - `src/staging/staging.controller.ts` — PATCH /staging/:id/favorite
  - `src/staging/staging.service.ts` — toggleFavorite
- **Notas tecnicas:** Migration aditiva, nao quebra nada. PATCH endpoint simples.

---

### FEAT-013: Undo/Redo na mascara
- **Prioridade:** P3
- **Impacto:** Medio
- **Esforço:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE
- **Descricao:** Ctrl+Z/Ctrl+Y na pintura da mascara. Atualmente se o utilizador erra, tem de apagar manualmente ou limpar tudo.
- **Criterios de aceitacao:**
  - Ctrl+Z desfaz ultimo traco
  - Ctrl+Y refaz
  - Botoes visuais de undo/redo na toolbar
  - Stack de pelo menos 20 estados
- **Ficheiros FE afetados:**
  - `app/screens/mask/mask.hook.tsx` — stack de canvas snapshots (ImageData)
  - `app/screens/mask/MaskScreen.tsx` — botoes undo/redo + keyboard listener
- **Ficheiros BE afetados:** Nenhum
- **Notas tecnicas:** Guardar `canvas.getImageData()` apos cada mouseup/touchend. Limitar stack a 20 para nao consumir demasiada memoria.

---

## P4 — Futuro

### FEAT-014: Dashboard com metricas de uso
- **Prioridade:** P4
- **Impacto:** Baixo
- **Esforço:** Medio
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Pagina mostrando: total de geracoes, estilos mais usados, geracoes por mes. Engagement e sensacao de "conta premium".
- **Criterios de aceitacao:**
  - Pagina /dashboard acessivel pelo header
  - Graficos: geracoes/mes, distribuicao por estilo
  - Totais: geracoes totais, favoritos, partilhas
- **Ficheiros FE afetados:**
  - `app/(routes)/dashboard/page.tsx` — nova pagina
  - `app/screens/dashboard/DashboardScreen.tsx` — nova screen
  - `app/lib/api.ts` — `getUserStats(token)`
- **Ficheiros BE afetados:**
  - `src/staging/staging.controller.ts` — GET /staging/stats
  - `src/staging/staging.service.ts` — aggregations Prisma
- **Notas tecnicas:** Prisma `groupBy` para agregacoes. Lib de graficos: recharts ou chart.js.

---

### FEAT-015: Integracao com portais imobiliarios
- **Prioridade:** P4
- **Impacto:** Alto
- **Esforço:** Alto
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Publicar resultado diretamente em portais como Idealista, Imovirtual, ou CasaSapo. Diferenciador enorme para agentes imobiliarios.
- **Criterios de aceitacao:**
  - Botao "Publicar em..." no resultado
  - Integracao com pelo menos 1 portal (Idealista API)
  - Upload automatico da imagem staged
- **Ficheiros FE afetados:**
  - `app/screens/result/ResultScreen.tsx` — botao publicar
  - `app/lib/api.ts` — `publishToPortal(token, stagingId, portal)`
- **Ficheiros BE afetados:**
  - `src/integrations/` — novo modulo
  - APIs de terceiros (investigacao necessaria)
- **Notas tecnicas:** APIs de portais imobiliarios sao limitadas e requerem parcerias. Investigar antes de implementar.

---

### FEAT-016: Video / 360 walkthrough
- **Prioridade:** P4
- **Impacto:** Muito alto
- **Esforço:** Muito alto
- **Estado:** Todo
- **Repositorio(s):** FE + BE
- **Descricao:** Gerar multiplos angulos da mesma divisao para criar um mini-walkthrough. Diferenciador massivo no mercado.
- **Criterios de aceitacao:**
  - Gerar 4-6 angulos a partir de uma foto
  - Player de video ou viewer 360 no resultado
  - Export como video MP4
- **Ficheiros FE afetados:** Novo fluxo completo
- **Ficheiros BE afetados:** Novo modelo de IA, novo pipeline
- **Notas tecnicas:** Requer investigacao de modelos (Zero123, SV3D, ou similares). Custo elevado por geracao. Feature premium exclusiva.
