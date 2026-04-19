# contexts

## Objetivo
Estado global da app via React Context. Partilha dados que precisam de estar acessíveis em qualquer componente sem prop drilling.

## Regras
- Um contexto por ficheiro
- Exportar sempre o Provider e o hook de acesso (`useAuth`, etc.)
- O Provider é registado em `app/layout.tsx` — não o adicionar dentro de screens
- Sem lógica de UI aqui — só estado, efeitos e funções de mutação

## Contextos existentes

### `authContext.tsx`
Gere a autenticação do utilizador.

**Estado exposto:**
- `token: string | null` — JWT guardado em cookie via `js-cookie`
- `isAuthenticated: boolean`
- `login(email, password): Promise<void>` — chama `loginUser` da api.ts, guarda token em cookie
- `register(email, password, name?): Promise<void>` — chama `registerUser`, guarda token
- `logout(): void` — remove cookie, limpa estado

**Efeito de segurança:**
Verifica `isTokenExpired()` no load e a cada 30s. Se expirado, faz logout automático.

**Como consumir:**
```tsx
const { token, isAuthenticated, logout } = useAuth();
```

## Como adicionar um contexto
1. Criar `app/contexts/<nome>Context.tsx`
2. Exportar `<Nome>Provider` e `use<Nome>` hook
3. Registar o Provider em `app/layout.tsx`
4. Documentar aqui
