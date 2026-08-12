import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Upload, GripVertical } from "lucide-react";
import { uploadMedia } from "@/lib/uploadMedia";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  active: boolean;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Reordenacao (drag & drop)
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [grabbedIndex, setGrabbedIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const [form, setForm] = useState({ name: "", slug: "", description: "", active: true });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("frozen_categories")
      .select("*")
      .order("sort_order");
    if (!error && data) setCategories(data as Category[]);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const startCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", active: true });
    setImageFile(null);
    setImagePreview(null);
    setCreating(true);
  };

  const startEdit = (cat: Category) => {
    setCreating(false);
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, active: cat.active });
    setImageFile(null);
    setImagePreview(cat.image_url);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const { url } = await uploadMedia(file, "categories");
      return url;
    } catch (e) {
      showMessage(e instanceof Error ? e.message : "Erro no upload", "error");
      return null;
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      showMessage("Nome e slug sao obrigatorios.", "error");
      return;
    }
    setSaving(true);

    let imageUrl: string | null = editing?.image_url || null;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
      else { setSaving(false); return; }
    }

    if (editing) {
      const { error } = await supabase
        .from("frozen_categories")
        .update({ name: form.name, slug: form.slug, description: form.description, image_url: imageUrl, active: form.active })
        .eq("id", editing.id);
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Categoria atualizada!", "success"); cancelForm(); }
    } else {
      const { error } = await supabase
        .from("frozen_categories")
        .insert({ name: form.name, slug: form.slug, description: form.description, image_url: imageUrl, active: form.active, sort_order: categories.length });
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Categoria criada!", "success"); cancelForm(); }
    }

    setSaving(false);
    fetchCategories();
  };

  const handleToggleActive = async (cat: Category) => {
    const { error } = await supabase.from("frozen_categories").update({ active: !cat.active }).eq("id", cat.id);
    if (error) {
      showMessage("Erro ao atualizar: " + error.message, "error");
      return;
    }
    fetchCategories();
  };

  const persistOrder = async (list: Category[]) => {
    setSavingOrder(true);
    const results = await Promise.all(
      list.map((cat, index) =>
        supabase.from("frozen_categories").update({ sort_order: index }).eq("id", cat.id)
      )
    );
    setSavingOrder(false);

    const failed = results.find((r) => r.error);
    if (failed?.error) {
      showMessage("Erro ao salvar a ordem: " + failed.error.message, "error");
      fetchCategories();
    } else {
      showMessage("Ordem atualizada!", "success");
    }
  };

  const resetDrag = () => {
    setDragIndex(null);
    setOverIndex(null);
    setGrabbedIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      resetDrag();
      return;
    }
    const next = [...categories];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    const reordered = next.map((cat, index) => ({ ...cat, sort_order: index }));
    setCategories(reordered);
    resetDrag();
    persistOrder(reordered);
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Tem certeza que deseja excluir "${cat.name}"? Isso vai excluir todos os sabores e tamanhos desta categoria.`)) return;
    if (cat.image_url) {
      const path = cat.image_url.split("/product-images/").pop();
      if (path) await supabase.storage.from("product-images").remove([path]);
    }
    const { error } = await supabase.from("frozen_categories").delete().eq("id", cat.id);
    if (error) showMessage("Erro: " + error.message, "error");
    else { showMessage("Categoria excluida.", "success"); fetchCategories(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-foreground text-lg">Categorias</h2>
          <p className="text-muted-foreground text-sm">Gerencie as categorias de marmitas (Fitness, Caseira, etc.)</p>
          <p className="text-muted-foreground text-xs flex items-center gap-1.5 mt-0.5">
            {savingOrder ? <><Loader2 className="h-3 w-3 animate-spin" /> Salvando a ordem...</> : "Arraste pelo ícone ⠿ para definir a ordem que aparece no site."}
          </p>
        </div>
        <Button variant="cta" size="sm" onClick={startCreate}>
          <Plus className="h-4 w-4" /> Nova categoria
        </Button>
      </div>

      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
          {message.text}
        </div>
      )}

      {(creating || editing) && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">{editing ? "Editar categoria" : "Nova categoria"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nome *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : generateSlug(e.target.value) }))}
                placeholder="Ex: Fitness"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Slug *</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="Ex: fitness"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Descricao</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Breve descricao da categoria..."
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Image upload */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Imagem</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-border" />
              )}
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> {imagePreview ? "Trocar imagem" : "Enviar imagem"}
                </Button>
                <p className="text-muted-foreground text-xs mt-1">JPG, PNG ou WebP — convertidas e comprimidas automaticamente</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} id="cat-active" className="rounded" />
            <label htmlFor="cat-active" className="text-sm text-foreground">Ativa</label>
          </div>
          <div className="flex gap-2">
            <Button variant="cta" onClick={handleSave} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</> : "Salvar"}
            </Button>
            <Button variant="outline" onClick={cancelForm}>Cancelar</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma categoria cadastrada.</div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              draggable={grabbedIndex === index}
              onDragStart={() => setDragIndex(index)}
              onDragOver={(e) => { e.preventDefault(); if (overIndex !== index) setOverIndex(index); }}
              onDragLeave={() => setOverIndex((i) => (i === index ? null : i))}
              onDrop={(e) => { e.preventDefault(); handleDrop(index); }}
              onDragEnd={resetDrag}
              className={`flex items-center gap-3 bg-card border rounded-xl px-4 py-3 transition-all ${!cat.active ? "opacity-50" : ""} ${dragIndex === index ? "opacity-40" : ""} ${overIndex === index && dragIndex !== null && dragIndex !== index ? "border-primary ring-2 ring-primary/30" : "border-border"}`}
            >
              <button
                type="button"
                title="Arraste para reordenar"
                onPointerDown={() => setGrabbedIndex(index)}
                onPointerUp={() => setGrabbedIndex(null)}
                className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              {cat.image_url ? (
                <img loading="lazy" decoding="async" src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-lg">🍱</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground text-sm truncate">{cat.name}</p>
                  <span className="text-muted-foreground text-xs bg-muted px-2 py-0.5 rounded-full">{cat.slug}</span>
                  {!cat.active && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Oculta</span>}
                </div>
                <p className="text-muted-foreground text-xs truncate">{cat.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleToggleActive(cat)} title={cat.active ? "Desativar" : "Ativar"} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  {cat.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => startEdit(cat)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(cat)} title="Excluir" className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
