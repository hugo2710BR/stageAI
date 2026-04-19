# (routes)

## Objetivo
Definir as rotas do Next.js App Router. Cada subpasta = um URL público da app.

## Regra fundamental
Esta pasta contém **apenas** `page.tsx` — ficheiros de rota mínimos.
A UI real fica em `app/screens/<nome>/`. O `page.tsx` importa o screen correspondente e renderiza-o.

## Estrutura de cada page.tsx
Todas as páginas são re-exports limpos — o screen inclui o seu próprio layout:
```tsx
export { default } from "../../screens/xxx/XxxScreen";
```
Excepção: `pricing/page.tsx` é inline por ser uma página estática sem screen próprio.

## Rotas existentes
| Pasta | URL | Screen |
|---|---|---|
| `login/` | `/login` | `screens/login/LoginScreen.tsx` |
| `register/` | `/register` | `screens/register/RegisterScreen.tsx` |
| `staging/` | `/staging` | `screens/home/HomeScreen.tsx` |
| `history/` | `/history` | `screens/history/HistoryScreen.tsx` |
| `pricing/` | `/pricing` | inline (página estática, sem lógica) |

## Requisitos
- Nenhum `useState`, `useEffect`, `fetch` ou lógica de negócio aqui
- Sem imports de `api.ts`, `imageUtils.ts` ou hooks de screen
- A proteção de rotas é feita no `middleware.ts` na raiz — não replicar aqui
