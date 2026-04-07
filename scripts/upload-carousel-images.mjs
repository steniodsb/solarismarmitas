/**
 * Script para upload das imagens dos carrosséis e atualização do banco.
 *
 * Uso:
 *   node scripts/upload-carousel-images.mjs <SUPABASE_SERVICE_ROLE_KEY>
 *
 * O script:
 * 1. Faz upload de todas as imagens da pasta imagens/Carrosseis/ para o bucket promo-line-gallery
 * 2. Insere os registros na tabela promo_line_gallery
 * 3. Atualiza o preço do suco para R$9,90
 * 4. Atualiza os sabores dos sucos
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

const SUPABASE_URL = "https://ixcgauiwwopvzbifnyit.supabase.co";
const SERVICE_KEY = process.argv[2];

if (!SERVICE_KEY) {
  console.error("Uso: node scripts/upload-carousel-images.mjs <SUPABASE_SERVICE_ROLE_KEY>");
  console.error("\nEncontre a key em: Supabase Dashboard → Settings → API → service_role (secret)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const FOLDER_TO_SLUG = {
  Caseiras: "tradicional",
  Fitness: "fitness",
  Lowcarb: "low-carb",
  Vegetarianas: "vegetariana",
};

async function main() {
  console.log("=== MARMITAS SOLARIS — Atualizações Supabase ===\n");

  // 1. Atualizar preço do suco
  console.log("1. Atualizando preço do suco para R$9,90...");
  const { error: priceErr } = await supabase
    .from("frozen_sizes")
    .update({ price: 9.90 })
    .eq("id", "3e8dc769-f7e8-4bc5-a146-919d4094d348");
  if (priceErr) console.error("   ERRO:", priceErr.message);
  else console.log("   OK!");

  // 2. Atualizar sabores dos sucos
  console.log("\n2. Atualizando sabores dos sucos...");
  const sucoUpdates = [
    { id: "431ccdc9-da8d-4c53-8043-d47b574ad787", name: "Detox", description: "Suco detox natural" },
    { id: "bcd226aa-b28c-48fb-bd08-aa3721782852", name: "Xô Inchaço", description: "Suco funcional para desinchar" },
    { id: "e8444045-2fb9-4302-b7a3-f151b8eefe02", name: "Frutas Vermelhas", description: "Suco de frutas vermelhas natural" },
    { id: "78fb1e6e-67c6-47e7-b57e-76a12c75ab19", name: "Mamão", description: "Suco de mamão natural" },
    { id: "f6244824-ac12-4689-9ce2-e5962cb349d1", name: "Abacaxi", description: "Suco de abacaxi natural" },
    { id: "ade42e43-63ce-4997-9527-223cf7f473ce", name: "Laranja", description: "Suco de laranja natural" },
  ];
  for (const suco of sucoUpdates) {
    const { error } = await supabase
      .from("frozen_flavors")
      .update({ name: suco.name, description: suco.description })
      .eq("id", suco.id);
    if (error) console.error(`   ERRO (${suco.name}):`, error.message);
    else console.log(`   OK: ${suco.name}`);
  }

  // 3. Limpar galeria antiga de promo_line_gallery
  console.log("\n3. Limpando galeria antiga...");
  const { error: delErr } = await supabase
    .from("promo_line_gallery")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all
  if (delErr) console.error("   ERRO:", delErr.message);
  else console.log("   OK!");

  // 4. Upload das imagens e inserção no banco
  console.log("\n4. Fazendo upload das imagens dos carrosséis...");
  const carouselsDir = path.join(PROJECT_ROOT, "imagens", "Carrosseis");

  for (const [folder, lineSlug] of Object.entries(FOLDER_TO_SLUG)) {
    const folderPath = path.join(carouselsDir, folder);
    if (!fs.existsSync(folderPath)) {
      console.error(`   Pasta não encontrada: ${folderPath}`);
      continue;
    }

    const files = fs.readdirSync(folderPath).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
    console.log(`\n   ${folder} (${lineSlug}): ${files.length} imagens`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(folderPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      const storagePath = `${lineSlug}/${Date.now()}-${i}${ext}`;

      // Upload para Storage
      const { error: uploadErr } = await supabase.storage
        .from("promo-line-gallery")
        .upload(storagePath, fileBuffer, {
          contentType: ext === ".png" ? "image/png" : "image/jpeg",
          upsert: false,
        });

      if (uploadErr) {
        console.error(`   ERRO upload (${file}):`, uploadErr.message);
        continue;
      }

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from("promo-line-gallery")
        .getPublicUrl(storagePath);

      // Inserir no banco
      const { error: insertErr } = await supabase
        .from("promo_line_gallery")
        .insert({
          line_slug: lineSlug,
          image_url: urlData.publicUrl,
          alt_text: `Marmita ${folder} ${i + 1}`,
          sort_order: i,
          active: true,
        });

      if (insertErr) console.error(`   ERRO insert (${file}):`, insertErr.message);
      else console.log(`   OK: ${file} → ${storagePath}`);
    }
  }

  console.log("\n=== Concluído! ===");
}

main().catch(console.error);
