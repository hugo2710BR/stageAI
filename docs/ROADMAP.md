# StageAI — Roadmap

> Ultima atualizacao: 2026-04-18

---

## Semana 1-2 — Converter e proteger

**Objetivo:** Proteger custos e melhorar conversao da landing page.

| Feature | ID | Esforço | Repositorio |
|---|---|---|---|
| Rate limiting + planos (3 free/mes) | FEAT-001 | Medio | FE + BE |
| Galeria before/after na landing | FEAT-002 | Baixo | FE |
| Pagina de planos (UI, sem pagamento) | FEAT-001 (parcial) | Baixo | FE |

**Entregaveis:**
- Utilizadores gratuitos limitados a 3 geracoes/mes
- Landing page com exemplos reais de before/after
- Pagina /pricing com planos e precos (sem checkout ainda)

**Risco:** Sem rate limiting, qualquer utilizador pode gerar custos ilimitados a $0.05/geracao.

---

## Semana 3-4 — Monetizar

**Objetivo:** Receita real e funcionalidades de retencao.

| Feature | ID | Esforço | Repositorio |
|---|---|---|---|
| Integracao Stripe | FEAT-004 | Alto | FE + BE |
| Partilha publica por link | FEAT-005 | Medio | FE + BE |
| Variacoes no resultado | FEAT-003 | Baixo | FE + BE |

**Entregaveis:**
- Checkout funcional com Stripe (subscricoes + pacotes avulso)
- Links publicos para partilhar resultados
- Botao "Gerar variacao" no resultado

**Dependencia:** FEAT-001 deve estar concluida antes de ativar Stripe.

---

## Semana 5-6 — Reter e expandir

**Objetivo:** Funcionalidades que fazem utilizadores voltar.

| Feature | ID | Esforço | Repositorio |
|---|---|---|---|
| Exportacao PDF com branding | FEAT-006 | Medio | FE + BE |
| Estilos custom guardados | FEAT-007 | Medio | FE + BE |
| Onboarding guiado | FEAT-010 | Baixo | FE |

**Entregaveis:**
- PDF profissional com before/after + branding
- Estilos personalizados reutilizaveis
- Tour para novos utilizadores

---

## Apos Semana 6 — Backlog aberto

Priorizar com base em feedback de utilizadores e metricas:

- FEAT-008: Multiplos estilos em paralelo
- FEAT-009: Modo "mobilar tudo" sem mascara manual
- FEAT-011: Comparacao side-by-side
- FEAT-012: Favoritos no historico
- FEAT-013: Undo/Redo na mascara
- FEAT-014: Dashboard metricas
- FEAT-015: Integracao portais imobiliarios
- FEAT-016: Video / 360 walkthrough
