# lib

## Objetivo
Funções utilitárias puras — sem estado, sem UI, sem chamadas diretas ao contexto React.

## Regras
- Funções de imagem ficam em `imageUtils.ts`
- Funções de comunicação com o backend ficam em `api.ts`
- Se precisares de um terceiro tipo de utilitário (formatação, validação, datas), criar `utils.ts` separado
- Nenhuma função aqui importa componentes ou contextos React

## Ficheiros existentes

### `api.ts`
Cliente HTTP para o backend NestJS (`stageai-api`, porta 3001).
Todas as funções recebem `token` como primeiro argumento quando a rota é autenticada.
Trata automaticamente respostas 401 — remove cookie e redireciona para `/login`.

| Função | Método | Rota | Auth |
|---|---|---|---|
| `registerUser(email, password, name?)` | POST | `/auth/register` | Não |
| `loginUser(email, password)` | POST | `/auth/login` | Não |
| `createStaging(token, image, mask, style, prompt, w?, h?)` | POST | `/staging` | Sim |
| `getUsage(token)` | GET | `/staging/usage` | Sim |
| `getStagingHistory(token)` | GET | `/staging` | Sim |
| `deleteStaging(token, id)` | DELETE | `/staging/:id` | Sim |

### `imageUtils.ts`
Funções de manipulação de imagem — correm exclusivamente no browser.

| Função | Descrição |
|---|---|
| `fileToBase64(file)` | Converte File para data URL base64 |
| `resizeImage(dataUrl, maxSize?)` | Redimensiona mantendo aspect ratio (default 1024px, JPEG 0.92) |
| `extractMask(canvas, w, h)` | Gera máscara PNG binária: branco=gerar, preto=preservar. Threshold brightness > 30 |
