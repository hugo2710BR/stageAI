# API Routes — StageAI

## `/api/stage` — POST

### Responsabilidade
Proxy seguro entre o frontend e a Replicate API.
O token NUNCA sai do servidor.

### Input esperado (JSON body)
```typescript
{
  image: string;   // base64 data URL da foto do imóvel (max ~1024px)
  mask: string;    // base64 PNG — branco=gerar, preto=preservar
  style: string;   // "Moderno" | "Escandinavo" | "Industrial" | "Mediterrâneo"
  prompt: string;  // texto livre do utilizador (pode ser vazio)
}
```

### Output (JSON)
```typescript
// Sucesso
{ result: string }  // URL pública da imagem gerada pelo Replicate

// Erro
{ error: string }   // mensagem legível pelo utilizador
```

### Modelo Replicate usado
```
stability-ai/stable-diffusion-inpainting
versão: 95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3
```

### Parâmetros de geração
- `num_inference_steps`: 25 (balanço qualidade/velocidade)
- `guidance_scale`: 7.5 (fidelidade ao prompt)
- `scheduler`: DPMSolverMultistep
- `negative_prompt`: blurry, low quality, distorted, unrealistic, cartoon, painting, watermark, text

### Mapa de estilos → prompts
| Estilo | Prompt injetado automaticamente |
|---|---|
| Moderno | modern interior design, clean lines, neutral tones, contemporary furniture |
| Escandinavo | scandinavian interior design, light wood furniture, white walls, cozy hygge |
| Industrial | industrial interior design, exposed brick, metal accents, dark tones, loft style |
| Mediterrâneo | mediterranean interior design, warm terracotta tones, natural textures, arched details |

### Como testar localmente
```bash
curl -X POST http://localhost:3000/api/stage \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,...","mask":"data:image/png;base64,...","style":"Moderno","prompt":""}'
```

### Variável de ambiente obrigatória
```
REPLICATE_API_TOKEN=r8_...
```
Sem esta variável, a route lança erro 500.

## Adicionar novas routes
Se precisares de novas routes (ex: histórico, auth), criar em `app/api/[nome]/route.ts`.
Seguir o mesmo padrão: validar input → chamar serviço externo → devolver JSON limpo.
