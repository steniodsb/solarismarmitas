/**
 * Servidor de produção do Solaris Marmitas.
 *
 * O Vite só gera arquivos estáticos em dist/ — não sobe servidor nenhum.
 * Sem este processo escutando na porta, o Dokploy/Traefik não tem o que
 * rotear e devolve 502.
 *
 * Faz três coisas:
 *   1. Serve dist/ com cache agressivo nos assets versionados
 *   2. Fallback de SPA: qualquer rota desconhecida devolve index.html
 *      (sem isso /montar/fitness e /admin dão 404 ao recarregar)
 *   3. /healthz para o healthcheck do orquestrador
 *
 * O endpoint de assinatura de upload do R2 entra aqui quando as
 * credenciais estiverem disponíveis.
 */
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { registrarRotasR2 } from './server-r2.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // dentro do container, precisa aceitar de fora do loopback

console.log(`[boot] node=${process.version} PORT=${PORT} NODE_ENV=${process.env.NODE_ENV || '-'}`);
console.log(`[boot] cwd=${process.cwd()} dist=${DIST}`);

// dist/ está no .gitignore, então só existe se o build tiver rodado no host.
// Se o builder não rodou "npm run build", construímos aqui — sem isso o
// processo morreria e o proxy devolveria 502.
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.warn('[boot] dist/index.html não encontrado — rodando "npm run build" agora.');
  try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  } catch (e) {
    console.error('[boot] o build falhou:', e.message);
    process.exit(1);
  }
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('[boot] build terminou mas dist/index.html continua ausente. Abortando.');
    process.exit(1);
  }
  console.log('[boot] build concluído.');
}

const app = express();
app.disable('x-powered-by');
app.use(compression());
app.use(express.json({ limit: '1mb' })); // corpo dos endpoints de mídia

app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));

// Mídia no R2: presign de upload, delete e leitura. Precisa vir antes do
// fallback de SPA, senão /midia/* e /api/* devolveriam o index.html.
registrarRotasR2(app);

// Assets com hash no nome nunca mudam de conteúdo — cache longo.
app.use('/assets', express.static(path.join(DIST, 'assets'), {
  immutable: true,
  maxAge: '1y',
}));

// Demais estáticos (favicon, robots, /products/*): cache curto.
app.use(express.static(DIST, { maxAge: '1h', index: false }));

// SPA fallback — precisa vir depois dos estáticos.
// Usa app.use() em vez de app.get('*'): no Express 5 o wildcard sem nome
// quebra o path-to-regexp. Assim funciona no 4 e no 5.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(DIST, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`[boot] Solaris Marmitas servindo dist/ em http://${HOST}:${PORT}`);
});
