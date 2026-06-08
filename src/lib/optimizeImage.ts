/**
 * Otimiza uma imagem antes do upload: redimensiona se muito grande,
 * converte para WebP e comprime. Roda 100% no browser via canvas.
 *
 * - Não altera a visualização final (imagens já são exibidas em <img>;
 *   todos os browsers suportam WebP desde 2021).
 * - Tamanho máximo aplicado para evitar enviar foto de celular 4000x3000.
 */

export interface OptimizeOptions {
  maxWidth?: number;   // largura máxima em px (lado maior será reduzido)
  maxHeight?: number;
  quality?: number;    // 0..1
  mimeType?: "image/webp" | "image/jpeg";
}

const DEFAULTS: Required<OptimizeOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.82,
  mimeType: "image/webp",
};

export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {},
): Promise<File> {
  const opts = { ...DEFAULTS, ...options };

  // SVG e GIF animados: não tocar (canvas perderia animação / vetorial)
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  const bitmap = await loadBitmap(file);
  const { width, height } = scaleDown(bitmap.width, bitmap.height, opts.maxWidth, opts.maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, opts.mimeType, opts.quality),
  );

  if (!blob) return file;

  // Se o resultado ficou maior que o original (raro, mas acontece com PNG
  // pequeno já otimizado), mantém o original.
  if (blob.size >= file.size) return file;

  const ext = opts.mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${ext}`, {
    type: opts.mimeType,
    lastModified: file.lastModified,
  });
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  if ("createImageBitmap" in window) {
    return await createImageBitmap(file);
  }
  // Fallback (browsers muito antigos)
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    return (img as unknown) as ImageBitmap;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function scaleDown(w: number, h: number, maxW: number, maxH: number) {
  if (w <= maxW && h <= maxH) return { width: w, height: h };
  const r = Math.min(maxW / w, maxH / h);
  return { width: Math.round(w * r), height: Math.round(h * r) };
}
