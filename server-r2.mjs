/**
 * Camada de mídia em Cloudflare R2 (S3-compatível), do lado do servidor.
 *
 * Por que existe: as chaves do R2 são SECRETAS. Diferente da chave anon do
 * Supabase (pública por design, protegida por RLS), a S3_SECRET_ACCESS_KEY
 * daria escrita total no bucket a qualquer visitante se fosse para o bundle.
 * Então o navegador nunca a vê: ele pede uma URL pré-assinada aqui, e sobe
 * o arquivo direto para o R2 com ela.
 *
 * Variáveis (painel do host, botão "Storage (R2/S3)"):
 *   S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 *   S3_PUBLIC_URL  (opcional — ver nota abaixo)
 *
 * Sobre S3_PUBLIC_URL: é o endereço por onde o navegador LÊ as imagens.
 * Se estiver definida (ex.: https://cdn.solarismarmitas.com.br), as imagens
 * são servidas direto pela Cloudflare. Se não estiver, caímos no proxy
 * /midia/* deste mesmo servidor, que funciona sem configuração nenhuma —
 * só passa a banda pelo app em vez de ir direto pela borda.
 */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'node:crypto';

const {
  S3_ENDPOINT, S3_REGION = 'auto', S3_BUCKET,
  S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_PUBLIC_URL,
  VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_ANON_KEY,
} = process.env;

export const r2Configurado = Boolean(
  S3_ENDPOINT && S3_BUCKET && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY
);

let _cliente = null;
function cliente() {
  if (_cliente) return _cliente;
  _cliente = new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
    credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
  });
  return _cliente;
}

/** Endereço público de um objeto: domínio próprio se houver, senão o proxy local. */
export function urlPublica(key) {
  if (S3_PUBLIC_URL) return `${S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
  return `/midia/${key}`;
}

const TIPOS_ACEITOS = new Set([
  'image/webp', 'image/jpeg', 'image/png', 'image/gif', 'image/avif', 'image/svg+xml',
]);
const PASTAS_ACEITAS = new Set(['flavors', 'categories', 'promo-gallery', 'promo-line-gallery']);
const TAMANHO_MAX = 15 * 1024 * 1024; // 15 MB — o browser já otimiza antes de subir

/**
 * Só quem está logado no painel pode subir. Valida o access token contra o
 * próprio Supabase Auth — mesma fonte de verdade que o /admin usa.
 */
async function usuarioAutenticado(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;

  const base = VITE_SUPABASE_URL;
  const apikey = VITE_SUPABASE_PUBLISHABLE_KEY || VITE_SUPABASE_ANON_KEY;
  if (!base || !apikey) return null;

  try {
    const res = await fetch(`${base}/auth/v1/user`, {
      headers: { apikey, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user?.id ? user : null;
  } catch {
    return null;
  }
}

function chaveSegura(pasta, subpasta, contentType) {
  const ext = (contentType.split('/')[1] || 'bin').replace('jpeg', 'jpg').replace('svg+xml', 'svg');
  const aleatorio = crypto.randomBytes(8).toString('hex');
  // O nome do arquivo vem do cliente e nunca entra na key — só timestamp+random.
  // A subpasta é saneada para não permitir escapar do prefixo.
  const sub = String(subpasta || '').replace(/[^a-z0-9-_]/gi, '');
  const prefixo = sub ? `${pasta}/${sub}` : pasta;
  return `${prefixo}/${Date.now()}-${aleatorio}.${ext}`;
}

export function registrarRotasR2(app) {
  if (!r2Configurado) {
    console.warn('[r2] credenciais ausentes — upload continua indo para o Supabase Storage.');
    app.get('/api/storage/status', (_req, res) => res.json({ configurado: false }));
    return;
  }

  console.log(`[r2] ativo | bucket=${S3_BUCKET} | leitura=${S3_PUBLIC_URL || '/midia/* (proxy local)'}`);

  app.get('/api/storage/status', (_req, res) => {
    res.json({ configurado: true, publico: Boolean(S3_PUBLIC_URL) });
  });

  /** Devolve uma URL pré-assinada para o navegador subir direto no R2. */
  app.post('/api/storage/presign', async (req, res) => {
    try {
      const user = await usuarioAutenticado(req);
      if (!user) return res.status(401).json({ erro: 'nao autenticado' });

      const { pasta, contentType, tamanho } = req.body || {};
      if (!PASTAS_ACEITAS.has(pasta)) return res.status(400).json({ erro: 'pasta invalida' });
      if (!TIPOS_ACEITOS.has(contentType)) return res.status(400).json({ erro: 'tipo de arquivo nao aceito' });
      if (tamanho && Number(tamanho) > TAMANHO_MAX) return res.status(413).json({ erro: 'arquivo muito grande' });

      const key = chaveSegura(pasta, req.body?.subpasta, contentType);
      const url = await getSignedUrl(
        cliente(),
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          ContentType: contentType,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
        { expiresIn: 600 },
      );

      res.json({ url, key, urlPublica: urlPublica(key) });
    } catch (e) {
      console.error('[r2] presign falhou:', e.message);
      res.status(500).json({ erro: 'falha ao assinar upload' });
    }
  });

  /** Apaga um objeto (usado quando a imagem é trocada ou o registro é excluído). */
  app.delete('/api/storage/objeto', async (req, res) => {
    try {
      const user = await usuarioAutenticado(req);
      if (!user) return res.status(401).json({ erro: 'nao autenticado' });

      const key = String(req.body?.key || '');
      const pasta = key.split('/')[0];
      if (!key || !PASTAS_ACEITAS.has(pasta)) return res.status(400).json({ erro: 'key invalida' });

      await cliente().send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
      res.json({ ok: true });
    } catch (e) {
      console.error('[r2] delete falhou:', e.message);
      res.status(500).json({ erro: 'falha ao apagar' });
    }
  });

  /**
   * Proxy de leitura. Só é o caminho usado quando não há S3_PUBLIC_URL.
   * Com o domínio atrás da Cloudflare, o cache da borda absorve os hits
   * seguintes — o servidor só é tocado no primeiro.
   */
  app.get(/^\/midia\/(.+)/, async (req, res) => {
    const key = decodeURIComponent(req.params[0] || '');
    if (!key || key.includes('..')) return res.status(400).end();
    try {
      const obj = await cliente().send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
      res.setHeader('Content-Type', obj.ContentType || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      if (obj.ContentLength) res.setHeader('Content-Length', String(obj.ContentLength));
      if (obj.ETag) res.setHeader('ETag', obj.ETag);
      obj.Body.pipe(res);
    } catch (e) {
      if (e?.$metadata?.httpStatusCode === 404 || e.name === 'NoSuchKey') return res.status(404).end();
      console.error('[r2] leitura falhou:', key, e.message);
      res.status(500).end();
    }
  });
}
