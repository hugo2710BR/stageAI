# StageAI — Decision Log

> Ultima atualizacao: 2026-04-22

---

## DEC-001: Modelo de IA — Fal AI flux-pro/v1/fill

**Data:** 2026-04
**Estado:** Implementado e em producao

**Decisao:** Usar Fal AI com modelo `fal-ai/flux-pro/v1/fill` para inpainting (planos pagos).

**Contexto:**
- Projeto comecou com Replicate (stable-diffusion-inpainting)
- Migrado para Fal AI por melhor qualidade de resultados e API mais simples

**Custos:**
- $0.05 por geracao (flux-pro/v1/fill)
- Modelos mais baratos disponíveis para plano free (sem inpainting)

**Alternativas consideradas:**
- Replicate SD Inpainting — qualidade inferior, mantido como fallback
- DALL-E / Midjourney — APIs limitadas para inpainting especifico
- Self-hosted — custos de GPU incompativeis com fase atual

---

## DEC-002: Storage — Cloudflare R2

**Data:** 2026-04
**Estado:** Implementado e em producao

**Decisao:** Guardar imagens geradas no Cloudflare R2 com URLs permanentes.

**Contexto:**
- URLs do Fal AI sao temporarias (expiram)
- R2 e S3-compatible, sem egress fees
- URLs permanentes para historico e partilha futura

**Custos:**
- Storage: $0.015/GB/mes
- Egress: Gratis (diferenciador vs S3)

---

## DEC-003: Monetizacao — Lemon Squeezy (nao Stripe)

**Data:** 2026-04
**Estado:** Implementado e em producao

**Decisao:** Usar Lemon Squeezy como plataforma de pagamentos. Stripe foi descartado.

**Porque Lemon Squeezy:**
- Merchant of Record — trata VAT e impostos automaticamente
- Critico para vender na Europa sem complexidade fiscal
- API simples, webhook com HMAC-SHA256
- Plano futuro: migrar para Paddle (mais flexivel para pricing customizado)

**Implementacao:**
- `src/payments/payments.service.ts` — checkout + webhook handler
- Webhook valida assinatura com raw body (nao JSON.stringify)
- `user_id` passado como `custom_data` no checkout, recuperado no webhook
- `planUpgradedAt` guardado no User ao fazer upgrade — reset do contador de uso

**Planos ativos (lsVariantId no Postgres):**
| Plano | Geracoes/mes | lsVariantId |
|---|---|---|
| free | 3 | — |
| starter | 30 | 1549528 |
| pro | 100 | 1549619 |
| agency | Ilimitado | — |

---

## DEC-004: Posicionamento de mercado

**Data:** 2026-04
**Estado:** Definido

**Decisao:** Focar mercado portugues/iberico como entrada.

**Mensagem:** "Transforma uma divisao vazia numa foto que vende"

**Principios:**
- Nao comunicar tecnologia (IA, modelos, etc.) — comunicar resultado
- Copy em portugues, UI simples, sem jargao tecnico

**Publico-alvo:**
1. Agentes imobiliarios (primary)
2. Decoradores de interiores
3. Proprietarios que vendem/arrendam

---

## DEC-005: Arquitetura — Frontend e Backend separados

**Data:** 2026-03
**Estado:** Implementado

**Decisao:** Dois repositorios separados (stageai + stageai-api).

**Racional:**
- Seguranca: tokens de IA nunca expostos no frontend
- Deploy independente: FE no Vercel, BE no Railway
- Separacao de concerns

---

## DEC-006: Soft delete nos stagings

**Data:** 2026-04
**Estado:** Implementado

**Decisao:** Apagar um staging nao remove o registo da DB — define `deletedAt`.

**Racional:**
- Apagar um staging nao deve repor creditos mensais
- Se fosse hard delete, um utilizador podia apagar e gerar de novo indefinidamente
- O historico filtra por `deletedAt: null`
- O R2 e apagado (para nao ocupar espaco), o registo Postgres fica

---

## DEC-008: Remocao do plano free — trial unico de 3 geracoes

**Data:** 2026-04-22
**Estado:** Implementado em producao

**Decisao:** Eliminar o plano free recorrente. Utilizadores novos recebem 3 geracoes de trial (plano "free" na DB, invisivel na pricing page). Quando esgotam, fazem upgrade.

**Racional:**
- Publico-alvo B2B (agentes imobiliarios) nao precisa de free recorrente para decidir
- Abuso por contas multiplas eliminado (3 tentativas totais, nao por mes)
- Pricing page mais limpa com 3 planos pagos

**Implementacao:**
- Plano "free" marcado como `active: false` na DB
- Utilizadores novos continuam a comecar com `plan: "free"` (default no schema)
- Rate limiting e logica de trial mantidos intactos

---

## DEC-007: Diferenciacao por modelo de IA e acesso a masking

**Data:** 2026-04
**Estado:** Decisao tomada — implementacao futura

**Decisao:** O plano free nao tem acesso ao masking (inpainting). Usa um modelo mais barato de geracao full-room. Planos pagos (starter+) usam `flux-pro/v1/fill` com masking preciso.

**Racional:**
- `flux-pro/v1/fill` e o unico modelo Fal com inpainting real — nao pode ser partilhado entre planos sem impacto de custo
- O masking E o diferenciador principal do produto para profissionais
- Free users experimentam o resultado (full-room), pagam para ter controlo preciso (masking)
- Esta separacao justifica o upgrade de forma clara e tangivel

**Impacto no fluxo:**
- Free: Upload → Estilo → Gerar (sem step de mascara)
- Starter+: Upload → Mascara → Estilo → Gerar

**Modelos candidatos para free:**
- `fal-ai/flux/schnell` (~$0.003/geracao) — rapido, sem inpainting
- `fal-ai/flux/dev` (~$0.025/geracao) — melhor qualidade, sem inpainting

**Modelo free escolhido:** `fal-ai/flux/schnell` (~$0.003/geracao). Diferenca de qualidade clara vs flux-pro/v1/fill — argumento de upgrade forte e custo minimo no plano gratuito.
