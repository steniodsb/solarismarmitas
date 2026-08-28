/**
 * Ponto único de upload de imagem do painel.
 *
 * Fluxo com R2 (preferido):
 *   1. otimiza no navegador (resize + WebP) — ver optimizeImage
 *   2. pede uma URL pré-assinada ao servidor (as chaves do R2 são secretas
 *      e nunca chegam ao navegador)
 *   3. sobe o arquivo direto para o R2 com essa URL
 *
 * Se o servidor responder que o R2 não está configurado (dev local, por
 * exemplo), cai automaticamente no Supabase Storage — o painel continua
 * funcionando sem nenhuma mudança de comportamento para quem usa.
 */
import { supabase } from "@/integrations/supabase/client";
import { optimizeImage, IMAGE_PRESETS, UPLOAD_CACHE_CONTROL, type OptimizeOptions } from "./optimizeImage";

/** Pastas aceitas pelo servidor. O bucket do Supabase é derivado daqui. */
export type PastaMidia = "flavors" | "categories" | "promo-gallery" | "promo-line-gallery" | "testimonials";

const BUCKET_SUPABASE: Record<PastaMidia, string> = {
  flavors: "product-images",
  categories: "product-images",
  "promo-gallery": "promo-gallery",
  "promo-line-gallery": "promo-line-gallery",
  testimonials: "testimonials",
};

/** Preset de otimização por contexto de exibição. */
const PRESET_POR_PASTA: Record<PastaMidia, OptimizeOptions> = {
  flavors: IMAGE_PRESETS.card,
  categories: IMAGE_PRESETS.hero,
  "promo-gallery": IMAGE_PRESETS.gallery,
  "promo-line-gallery": IMAGE_PRESETS.gallery,
  testimonials: IMAGE_PRESETS.gallery,
};

let _r2Ativo: boolean | null = null;

/** Consulta uma vez por sessão se o servidor tem R2 configurado. */
async function r2Ativo(): Promise<boolean> {
  if (_r2Ativo !== null) return _r2Ativo;
  try {
    const res = await fetch("/api/storage/status");
    if (!res.ok) { _r2Ativo = false; return false; }
    const data = await res.json();
    _r2Ativo = Boolean(data?.configurado);
  } catch {
    _r2Ativo = false;
  }
  return _r2Ativo;
}

async function tokenDeAcesso(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

export interface ResultadoUpload {
  /** URL para gravar em image_url e renderizar no site. */
  url: string;
  /** Caminho dentro do bucket — guardar facilita apagar depois. */
  key: string;
  /** Onde o arquivo foi parar. */
  destino: "r2" | "supabase";
}

/**
 * Otimiza e sobe uma imagem. Lança Error com mensagem em português se falhar.
 *
 * `subpasta` agrupa dentro da pasta principal (a galeria de linhas usa o
 * slug da linha, ex.: promo-line-gallery/fitness/…).
 */
export async function uploadMedia(
  arquivo: File,
  pasta: PastaMidia,
  subpasta?: string,
): Promise<ResultadoUpload> {
  const otimizado = await optimizeImage(arquivo, PRESET_POR_PASTA[pasta]).catch(() => arquivo);
  const sub = subpasta?.replace(/[^a-z0-9-_]/gi, "") || undefined;

  if (await r2Ativo()) {
    return uploadParaR2(otimizado, pasta, sub);
  }
  return uploadParaSupabase(otimizado, pasta, sub);
}

async function uploadParaR2(arquivo: File, pasta: PastaMidia, subpasta?: string): Promise<ResultadoUpload> {
  const token = await tokenDeAcesso();
  if (!token) throw new Error("Sessão expirada. Faça login novamente para enviar imagens.");

  const assinatura = await fetch("/api/storage/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      pasta, subpasta, contentType: arquivo.type, tamanho: arquivo.size, nome: arquivo.name,
    }),
  });

  if (!assinatura.ok) {
    const detalhe = await assinatura.json().catch(() => ({}));
    throw new Error(`Não foi possível preparar o envio: ${detalhe?.erro ?? assinatura.status}`);
  }

  const { url, key, urlPublica } = await assinatura.json();

  const envio = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": arquivo.type,
      "Cache-Control": `public, max-age=${UPLOAD_CACHE_CONTROL}, immutable`,
    },
    body: arquivo,
  });
  if (!envio.ok) throw new Error(`Falha ao enviar a imagem (${envio.status}).`);

  return { url: urlPublica, key, destino: "r2" };
}

async function uploadParaSupabase(arquivo: File, pasta: PastaMidia, subpasta?: string): Promise<ResultadoUpload> {
  const bucket = BUCKET_SUPABASE[pasta];
  const ext = arquivo.name.split(".").pop();
  // Mantém o layout histórico dos buckets: product-images agrupa por
  // flavors/ e categories/; promo-gallery guarda na raiz; a galeria de
  // linhas agrupa pelo slug da linha.
  const prefixo =
    bucket === "product-images" ? `${pasta}/` :
    subpasta ? `${subpasta}/` : "";
  const key = `${prefixo}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(key, arquivo, {
    upsert: false,
    contentType: arquivo.type,
    cacheControl: UPLOAD_CACHE_CONTROL,
  });
  if (error) throw new Error(`Erro no upload: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(key);
  return { url: data.publicUrl, key, destino: "supabase" };
}

/**
 * Apaga uma imagem enviada anteriormente. Aceita a URL gravada no banco e
 * descobre sozinha se o arquivo está no R2 ou no Supabase.
 * Nunca lança: falhar em apagar não pode travar o salvamento do registro.
 */
export async function deleteMedia(urlOuKey: string): Promise<void> {
  if (!urlOuKey) return;

  try {
    // Supabase: a URL carrega /storage/v1/object/public/<bucket>/<key>
    const supa = urlOuKey.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (supa) {
      await supabase.storage.from(supa[1]).remove([supa[2]]);
      return;
    }

    // R2: proxy local (/midia/<key>) ou domínio próprio (…/<pasta>/<arquivo>)
    let key = urlOuKey.startsWith("/midia/")
      ? urlOuKey.slice("/midia/".length)
      : urlOuKey.replace(/^https?:\/\/[^/]+\//, "");
    if (!key) return;

    const token = await tokenDeAcesso();
    if (!token) return;
    await fetch("/api/storage/objeto", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key }),
    });
  } catch {
    // silencioso de propósito — ver docstring
  }
}
