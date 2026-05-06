/**
 * Cria a tabela analytics_events via Supabase Management API.
 * Uso: node scripts/create-analytics-table.mjs <SUPABASE_SERVICE_ROLE_KEY>
 *
 * Requer que a função `exec_sql` exista. Se não existir, este script
 * não consegue criar via API e o SQL precisa ser executado manualmente
 * no SQL Editor: supabase/migrations/20260506200000_analytics_events.sql
 */
import { readFile } from "node:fs/promises";

const SUPABASE_URL = "https://ixcgauiwwopvzbifnyit.supabase.co";
const SERVICE_KEY = process.argv[2];

if (!SERVICE_KEY) {
  console.error("Uso: node scripts/create-analytics-table.mjs <SERVICE_ROLE_KEY>");
  process.exit(1);
}

const sql = await readFile(
  new URL("../supabase/migrations/20260506200000_analytics_events.sql", import.meta.url),
  "utf8"
);

// Tenta via função exec_sql (caso exista no projeto)
const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: "POST",
  headers: {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ sql }),
});

if (res.ok) {
  console.log("OK — tabela criada");
} else {
  const text = await res.text();
  console.error(`Falhou (HTTP ${res.status}):`, text);
  console.error("\nPor favor, execute manualmente no SQL Editor:");
  console.error("https://supabase.com/dashboard/project/ixcgauiwwopvzbifnyit/sql");
  console.error("\nConteúdo SQL:\n");
  console.error(sql);
  process.exit(1);
}
