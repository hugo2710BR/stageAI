# StageAI — Roadmap

> Ultima atualizacao: 2026-04-22

---

## Concluido ✅ (Semana 1-4)

| Feature | Notas |
|---|---|
| Rate limiting + planos (FEAT-001) | Limites dinamicos via tabela Plan, soft delete, planUpgradedAt |
| Pagamentos Lemon Squeezy (FEAT-004) | Checkout + webhook + HMAC. Starter e Pro ativos. |
| Pricing page dinamica | Dados do BE, botao Upgrade funcional |
| Botao Upgrade animado | Gradiente cónico, aparece quando remaining === 0 |
| Landing page com Pricing | Link no nav, rota publica |
| Deploy FE + BE | Vercel + Railway em producao |

---

## Fase atual — Diferenciacao de produto

**Objetivo:** Justificar os planos pagos com features tangiveis.

| Feature | ID | Esforco | Repositorio |
|---|---|---|---|
| Free sem masking (modelo mais barato) | FEAT-NEW-001 | Medio | FE + BE |
| Galeria before/after na landing | FEAT-002 | Baixo | FE |
| Variacoes no resultado | FEAT-003 | Baixo | FE + BE |

**Entregaveis:**
- Fluxo free sem step de mascara (Upload → Estilo → Gerar)
- Starter+ mantem fluxo completo com masking
- Landing page com exemplos reais de before/after
- Botao "Gerar variacao" no resultado

**Decisao a tomar antes:** modelo Fal AI para free (flux/schnell vs flux/dev) e se a diferenca de qualidade e suficiente para motivar upgrade.

---

## Proxima fase — Retencao e valor

**Objetivo:** Features que fazem utilizadores voltar e justificam plano Pro.

| Feature | ID | Esforco | Repositorio |
|---|---|---|---|
| Pagina de conta (/account) | FEAT-NEW-002 | Medio | FE + BE |
| Partilha publica por link | FEAT-005 | Medio | FE + BE |
| Exportacao PDF com branding | FEAT-006 | Medio | FE |
| Onboarding guiado | FEAT-010 | Baixo | FE |

---

## Fase futura — Features premium (Pro / Agency)

| Feature | ID | Esforco |
|---|---|---|
| Auto-detecao de mascara (SAM) | FEAT-009 | Alto |
| Multiplos estilos em paralelo | FEAT-008 | Alto |
| Estilos custom guardados | FEAT-007 | Medio |
| Video / walkthrough | FEAT-016 | Muito alto |

---

## Backlog aberto (priorizar com feedback de utilizadores)

- FEAT-011: Comparacao side-by-side
- FEAT-012: Favoritos
- FEAT-013: Undo/Redo na mascara
- FEAT-014: Dashboard metricas
- FEAT-015: Integracao portais imobiliarios
