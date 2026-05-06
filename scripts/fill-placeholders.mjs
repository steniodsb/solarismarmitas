/**
 * Preenche cada categoria com placeholders até completar 10 sabores.
 *
 * Uso: node scripts/fill-placeholders.mjs <SUPABASE_SERVICE_ROLE_KEY>
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ixcgauiwwopvzbifnyit.supabase.co";
const SERVICE_KEY = process.argv[2];

if (!SERVICE_KEY) {
  console.error("Uso: node scripts/fill-placeholders.mjs <SUPABASE_SERVICE_ROLE_KEY>");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const TARGET_PER_CATEGORY = 10;

async function main() {
  const { data: categories, error: catErr } = await supabase
    .from("frozen_categories")
    .select("id, slug, name");

  if (catErr) {
    console.error("Erro buscando categorias:", catErr.message);
    process.exit(1);
  }

  for (const cat of categories) {
    const { data: existing, error: flavErr } = await supabase
      .from("frozen_flavors")
      .select("id, sort_order")
      .eq("category_id", cat.id)
      .order("sort_order", { ascending: false });

    if (flavErr) {
      console.error(`Erro buscando sabores de ${cat.name}:`, flavErr.message);
      continue;
    }

    const currentCount = existing.length;
    const maxSort = existing.length > 0 ? existing[0].sort_order : 0;
    const needed = TARGET_PER_CATEGORY - currentCount;

    if (needed <= 0) {
      console.log(`${cat.name}: ${currentCount}/${TARGET_PER_CATEGORY} — já tem suficiente, pulando.`);
      continue;
    }

    console.log(`${cat.name}: ${currentCount}/${TARGET_PER_CATEGORY} — adicionando ${needed} placeholders...`);

    const newRows = [];
    for (let i = 1; i <= needed; i++) {
      newRows.push({
        category_id: cat.id,
        name: `Sabor ${currentCount + i} (editar)`,
        description: "Descrição genérica - editar no admin",
        image_url: null,
        sort_order: maxSort + i,
        active: true,
      });
    }

    const { error: insertErr } = await supabase
      .from("frozen_flavors")
      .insert(newRows);

    if (insertErr) console.error(`   ERRO:`, insertErr.message);
    else console.log(`   ${needed} placeholders criados.`);
  }

  console.log("\n=== Concluído ===");
}

main().catch(console.error);
