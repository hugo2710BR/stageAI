/**
 * Converte um File para data URL base64.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Erro ao ler ficheiro"));
    reader.readAsDataURL(file);
  });
}

/**
 * Redimensiona uma imagem mantendo o aspect ratio.
 * O lado maior fica com maxSize pixels.
 */
export function resizeImage(
  dataUrl: string,
  maxSize = 1024
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        } else {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Erro ao criar canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => reject(new Error("Erro ao carregar imagem"));
    img.src = dataUrl;
  });
}

/**
 * Extrai a mascara do canvas como PNG base64 preto/branco.
 * Branco = area a gerar, preto = manter original.
 */
export function extractMask(
  maskCanvas: HTMLCanvasElement,
  width: number,
  height: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Erro ao criar canvas");

  ctx.drawImage(maskCanvas, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const value = brightness > 30 ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}
