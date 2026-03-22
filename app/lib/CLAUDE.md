# Lib / Utilitários — StageAI

## Ficheiros

### `imageUtils.ts`
Funções puras de manipulação de imagem. Todas correm no browser (não são compatíveis com Node.js/server).

#### `fileToBase64(file: File): Promise<string>`
Converte um File do input/drop para data URL base64.
Devolve string no formato `data:image/jpeg;base64,...`

#### `resizeImage(dataUrl: string, maxSize = 1024): Promise<string>`
Redimensiona mantendo aspect ratio. Necessário porque:
- Replicate tem limite de tamanho de input
- Imagens grandes aumentam o tempo de geração
- Qualidade JPEG 0.92 — bom balanço qualidade/tamanho

#### `extractMask(maskCanvas, width, height): string`
Gera a máscara binária para enviar à API:
- **Branco** = área onde a IA vai gerar mobília
- **Preto** = área que a IA vai preservar
- Aplica threshold de brightness > 30 para garantir preto/branco puro
- Devolve PNG base64

## Regras
- Nenhuma função aqui faz fetch ou acede à API
- Todas as funções são assíncronas onde necessário (FileReader, Canvas)
- Se adicionares utilitários relacionados com imagem, colocar aqui
- Se adicionares utilitários de outra natureza (ex: formatação, validação), criar `app/lib/utils.ts` separado
