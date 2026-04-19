# components

## Objetivo
Componentes reutilizáveis sem lógica de negócio — usados em mais do que um screen ou contexto.

## Regras
- Todos têm `"use client"` no topo
- Props sempre tipadas com interface local no próprio ficheiro
- Sem fetch, sem chamadas à `api.ts`, sem acesso ao `AuthContext`
- Styling exclusivamente com Tailwind — cor primária `emerald-600`
- Cada componente vive na sua própria subpasta com `index.ts` a re-exportar

## Componentes existentes

### `header/`
Barra de topo da app autenticada.
- Mostra logo StageAI, contador de gerações restantes (via `getUsage`), link Histórico, botão Logout
- Usa `AuthContext` para token e logout
- Faz um único `fetch` ao arranque para buscar o usage — não é um componente puramente visual

### `progressIndicator/`
Indicador de progresso do fluxo de 4 etapas.
- Props: `steps: readonly string[]`, `step: number` (1-based)
- Passo completo = círculo verde com ✓; ativo = verde; pendente = cinzento
- Sem estado interno, sem efeitos — componente puro

## Como adicionar um componente
1. Criar `app/components/<NomeComponente>/<NomeComponente>.tsx`
2. Criar `app/components/<NomeComponente>/index.ts` com `export { NomeComponente } from './<NomeComponente>'`
3. Documentar aqui: nome, props, comportamento
