# StageAI — Decision Log

> Ultima atualizacao: 2026-04-18

---

## DEC-001: Modelo de IA — Fal AI flux-pro/v1/fill

**Data:** 2026-04
**Estado:** Implementado e em producao

**Decisao:** Usar Fal AI com modelo `fal-ai/flux-pro/v1/fill` para inpainting.

**Contexto:**
- Projeto comecou com Replicate (stable-diffusion-inpainting)
- Migrado para Fal AI por melhor qualidade de resultados e API mais simples
- Replicate mantido como fallback comentado no codigo

**Custos:**
- $0.05 por geracao
- Sem custos fixos (pay-per-use)

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

## DEC-003: Monetizacao — Modelo hibrido

**Data:** 2026-04
**Estado:** Planeado (FEAT-001 + FEAT-004)

**Decisao:** Freemium com 3 niveis de subscricao + pay-per-use.

**Planos:**
| Plano | Preco | Geracoes/mes |
|---|---|---|
| Gratuito | €0 | 3 |
| Starter | €12/mes | 30 |
| Pro | €29/mes | 100 |
| Agency | €79/mes | Ilimitado |

**Pay-per-use:** Pacote de 10 creditos por €6 (qualquer plano).

**Racional:**
- 3 gratis permite experimentar sem compromisso
- Starter cobre agentes individuais esporadicos
- Pro para agentes ativos
- Agency para empresas com volume
- Pay-per-use para picos sem upgrade de plano

---

## DEC-004: Posicionamento de mercado

**Data:** 2026-04
**Estado:** Definido

**Decisao:** Focar mercado portugues/iberico como entrada.

**Mensagem:** "Transforma uma divisao vazia numa foto que vende"

**Principios:**
- Nao comunicar tecnologia (IA, modelos, etc.) — comunicar resultado
- O utilizador nao quer saber que modelo usa — quer fotos que vendem imoveis
- Copy em portugues, UI simples, sem jargao tecnico

**Publico-alvo:**
1. Agentes imobiliarios (primary)
2. Decoradores de interiores
3. Proprietarios que vendem/arrendam

**Concorrencia:**
- REimagineHome — US market, precos em USD
- Virtual Staging AI — generico, sem foco iberico
- BoxBrownie — manual (humanos), caro, lento (24-48h)
- StageAI diferencia-se: instantaneo, barato, focado no mercado local

---

## DEC-005: Arquitetura — Frontend e Backend separados

**Data:** 2026-03
**Estado:** Implementado

**Decisao:** Dois repositorios separados (stageai + stageai-api).

**Racional:**
- Seguranca: tokens de IA nunca expostos no frontend
- Deploy independente: FE no Vercel, BE no Railway
- Separacao de concerns: frontend nao sabe como a IA funciona
- Aprendizagem: Hugo aprende backend com NestJS dedicado

---

## DEC-006: Prioridades tecnicas imediatas

**Data:** 2026-04
**Estado:** Ativo

**Decisao:** Rate limiting e FEAT-001 antes de qualquer feature nova.

**Racional:**
- Sem limite, cada utilizador pode gerar custos ilimitados
- A $0.05/geracao, 1000 utilizadores x 10 geracoes = $500/dia
- Rate limiting e a unica feature que protege contra risco financeiro
- Todas as outras features podem esperar — esta nao pode

**Infra:**
- Railway: monitorizar cold starts, considerar plano pago se latencia aumentar
- PostgreSQL: backup automatico ativo no Railway
- R2: sem limites preocupantes na fase atual
