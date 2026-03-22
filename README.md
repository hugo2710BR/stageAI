# StageAI — Virtual Home Staging

Transform empty rooms into fully furnished spaces using AI-powered inpainting. Upload a photo, paint the area you want to furnish, pick a style, and get a realistic result in seconds.

## Demo Flow

1. **Upload** — Drag & drop or click to upload a room photo (JPG/PNG, max 10 MB)
2. **Mask** — Paint over the area you want to furnish
3. **Style & Prompt** — Choose a decoration style + optional free-text prompt
4. **Result** — Interactive before/after slider with download

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI Backend | [Replicate](https://replicate.com/) — Stable Diffusion Inpainting |
| Deploy | Vercel |

## Getting Started

### Prerequisites

- Node.js >= 18
- A [Replicate](https://replicate.com/) account (free credits on sign-up)

### Installation

```bash
git clone https://github.com/<your-username>/stageai.git
cd stageai
npm install
```

### Environment Variables

Copy the example file and add your token:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
REPLICATE_API_TOKEN=r8_your_token_here
```

> Get your token at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Available Styles

| Style | Description |
|---|---|
| Moderno | Clean lines, neutral tones, contemporary furniture |
| Escandinavo | Light wood, white walls, cozy hygge atmosphere |
| Industrial | Exposed brick, metal accents, dark tones, loft style |
| Mediterrâneo | Warm terracotta, natural textures, arched details |

## API Reference

### `POST /api/stage`

Proxies the request to Replicate. The API token never leaves the server.

**Request body:**

```json
{
  "image": "data:image/jpeg;base64,...",
  "mask": "data:image/png;base64,...",
  "style": "Moderno",
  "prompt": "grey leather sofa, marble coffee table"
}
```

**Response:**

```json
{ "result": "https://replicate.delivery/..." }
```

## License

MIT
