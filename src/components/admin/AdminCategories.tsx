import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

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

  const [form, setForm] = useState({ name: "", slug: "", description: "", image_url: "", active: true });

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
    setForm({ name: "", slug: "", description: "", image_url: "", active: true });
    setCreating(true);
  };

  const startEdit = (cat: Category) => {
    setCreating(false);
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description, image_url: cat.image_url || "", active: cat.active });
  };

  const cancelForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      showMessage("Nome e slug são obrigatórios.", "error");
      return;
    }
    setSaving(true);

    if (editing) {
      const { error } = await supabase
        .from("frozen_categories")
        .update({ name: form.name, slug: form.slug, description: form.description, image_url: form.image_url || null, active: form.active })
        .eq("id", editing.id);
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Categoria atualizada!", "success"); cancelForm(); }
    } else {
      const { error } = await supabase
        .from("frozen_categories")
        .insert({ name: form.name, slug: form.slug, description: form.description, image_url: form.image_url || null, active: form.active, sort_order: categories.length });
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Categoria criada!", "success"); cancelForm(); }
    }

    setSaving(false);
    fetchCategories();
  };

  const handleToggleActive = async (cat: Category) => {
    await supabase.from("frozen_categories").update({ active: !cat.active }).eq("id", cat.id);
    fetchCategories();
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Tem certeza que deseja excluir "${cat.name}"? Isso vai excluir todos os sabores e tamanhos desta categoria.`)) return;
    const { error } = await supabase.from("frozen_categories").delete().eq("id", cat.id);
    if (error) showMessage("Erro: " + error.message, "error");
    else { showMessage("Categoria excluída.", "success"); fetchCategories(); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-foreground text-lg">Categorias</h2>
          <p className="text-muted-foreground text-sm">Gerencie as categorias de marmitas (Fitness, Caseira, etc.)</p>
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

      {/* Form */}
      {(creating || editing) && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">{editing ? "Editar categoria" : "Nova categoria"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Nome *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, name: e.target.value, slug: editing ? f.slug : generateSlug(e.target.value) }));
                }}
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
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">URL da imagem (opcional)</label>
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
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

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Nenhuma categoria cadastrada.</div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 transition-all ${!cat.active ? "opacity-50" : ""}`}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              {cat.image_url && (
                <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
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
