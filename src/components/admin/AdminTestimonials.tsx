import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ImagePlus,
  Upload,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { uploadMedia, deleteMedia } from "@/lib/uploadMedia";

interface Testimonial {
  id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  active: boolean;
}

/**
 * Depoimentos ("Quem prova, aprova") — os prints de conversa que aparecem
 * no carrossel da home. A ordem daqui é a ordem do carrossel.
 */
export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order");
    if (error) showMessage("Erro ao carregar depoimentos: " + error.message, "error");
    else if (data) setItems(data as Testimonial[]);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let enviadas = 0;

    for (const arquivo of Array.from(files)) {
      let imageUrl: string;
      try {
        ({ url: imageUrl } = await uploadMedia(arquivo, "testimonials"));
      } catch (err) {
        showMessage(`Erro ao enviar ${arquivo.name}: ${err instanceof Error ? err.message : err}`, "error");
        continue;
      }

      const { error } = await supabase.from("testimonials").insert({
        image_url: imageUrl,
        alt_text: arquivo.name.replace(/\.[^.]+$/, ""),
        sort_order: items.length + enviadas,
        active: true,
      });

      if (error) showMessage(`Erro ao salvar ${arquivo.name}: ${error.message}`, "error");
      else enviadas++;
    }

    if (enviadas > 0) {
      showMessage(`${enviadas} depoimento(s) adicionado(s)!`, "success");
      fetchItems();
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleToggleActive = async (item: Testimonial) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ active: !item.active })
      .eq("id", item.id);
    if (error) {
      showMessage("Erro ao atualizar: " + error.message, "error");
      return;
    }
    fetchItems();
  };

  const handleDelete = async (item: Testimonial) => {
    if (!confirm("Tem certeza que deseja excluir este depoimento?")) return;
    await deleteMedia(item.image_url);
    const { error } = await supabase.from("testimonials").delete().eq("id", item.id);
    if (error) {
      showMessage("Erro ao excluir: " + error.message, "error");
      return;
    }
    showMessage("Depoimento excluído.", "success");
    fetchItems();
  };

  /** Troca de lugar com o vizinho e grava a nova ordem nos dois registros. */
  const handleMove = async (index: number, direcao: -1 | 1) => {
    const destino = index + direcao;
    if (destino < 0 || destino >= items.length) return;

    const atual = items[index];
    const vizinho = items[destino];

    // Otimista: o grid já reflete a nova ordem enquanto o banco atualiza.
    const novos = [...items];
    novos[index] = vizinho;
    novos[destino] = atual;
    setItems(novos);

    setReordering(true);
    const [a, b] = await Promise.all([
      supabase.from("testimonials").update({ sort_order: destino }).eq("id", atual.id),
      supabase.from("testimonials").update({ sort_order: index }).eq("id", vizinho.id),
    ]);
    setReordering(false);

    if (a.error || b.error) {
      showMessage("Erro ao reordenar: " + (a.error?.message || b.error?.message), "error");
      fetchItems();
    }
  };

  return (
    <>
      <h2 className="font-display font-bold text-foreground text-lg">Depoimentos de clientes</h2>
      <p className="text-muted-foreground text-sm -mt-4">
        As fotos aparecem no carrossel "O que nossos clientes dizem", na página inicial.
      </p>

      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-destructive/10 text-destructive border border-destructive/20"
        }`}>
          {message.text}
        </div>
      )}

      {/* Upload */}
      <div className="bg-card border-2 border-dashed border-border rounded-2xl p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <ImagePlus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground text-sm">Adicionar depoimentos</p>
          <p className="text-muted-foreground text-xs mt-0.5">
            JPG, PNG ou WebP. Pode selecionar várias de uma vez.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <Button variant="cta" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
          ) : (
            <><Upload className="h-4 w-4" /> Selecionar fotos</>
          )}
        </Button>
      </div>

      {/* Instruções */}
      <div className="bg-accent border border-primary/20 rounded-xl px-4 py-3 text-xs text-muted-foreground space-y-1">
        <p><span className="font-semibold text-foreground">← →</span> — muda a posição no carrossel (o primeiro aparece primeiro).</p>
        <p><span className="font-semibold text-foreground">👁 Ativo/Oculto</span> — depoimentos ocultos não aparecem no site.</p>
        <p><span className="font-semibold text-foreground">🗑 Excluir</span> — remove permanentemente o depoimento.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Nenhum depoimento cadastrado ainda.
        </div>
      ) : (
        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${reordering ? "opacity-70" : ""}`}>
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden border-2 border-border bg-muted ${
                !item.active ? "opacity-50" : ""
              }`}
            >
              <div className="absolute top-2 left-2 z-10 bg-foreground/70 text-background text-[10px] font-bold px-2 py-0.5 rounded-full">
                {index + 1}º
              </div>

              <div className="aspect-[3/4] flex items-center justify-center">
                <img
                  loading="lazy"
                  decoding="async"
                  src={item.image_url}
                  alt={item.alt_text ?? "depoimento"}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-between gap-1">
                <button
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0 || reordering}
                  title="Mover para trás"
                  className="w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleMove(index, 1)}
                  disabled={index === items.length - 1 || reordering}
                  title="Mover para frente"
                  className="w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/40 disabled:opacity-30 disabled:hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleToggleActive(item)}
                  title={item.active ? "Ocultar do site" : "Mostrar no site"}
                  className="w-7 h-7 rounded-full bg-white/20 text-white hover:bg-white/40 flex items-center justify-center transition-colors"
                >
                  {item.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  title="Excluir depoimento"
                  className="w-7 h-7 rounded-full bg-red-500/80 text-white hover:bg-red-600 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
