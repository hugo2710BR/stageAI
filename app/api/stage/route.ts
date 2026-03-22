import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";

const STYLE_PROMPTS: Record<string, string> = {
  Moderno:
    "modern interior design, clean lines, neutral tones, contemporary furniture, minimalist decor",
  Escandinavo:
    "scandinavian interior design, light wood furniture, white walls, cozy hygge atmosphere, natural materials",
  Industrial:
    "industrial interior design, exposed brick, metal accents, dark tones, loft style, raw concrete",
  "Mediterrâneo":
    "mediterranean interior design, warm terracotta tones, natural textures, arched details, bright airy space",
};

const NEGATIVE_PROMPT =
  "blurry, low quality, distorted, unrealistic, cartoon, painting, watermark, text";

export async function POST(request: NextRequest) {
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN nao configurado no servidor" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { image, mask, style, prompt } = body as {
      image: string;
      mask: string;
      style: string;
      prompt: string;
    };

    if (!image || !mask || !style) {
      return NextResponse.json(
        { error: "Campos obrigatorios em falta: image, mask, style" },
        { status: 400 }
      );
    }

    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS["Moderno"];
    const fullPrompt = prompt
      ? `${stylePrompt}, ${prompt}`
      : stylePrompt;

    const replicate = new Replicate({ auth: token });

    const output = await replicate.run(
      "stability-ai/stable-diffusion-inpainting:95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3",
      {
        input: {
          image,
          mask,
          prompt: fullPrompt,
          negative_prompt: NEGATIVE_PROMPT,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          scheduler: "DPMSolverMultistep",
        },
      }
    );

    const resultUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ result: resultUrl });
  } catch (err) {
    console.error("Erro na API /api/stage:", err);
    const message = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
