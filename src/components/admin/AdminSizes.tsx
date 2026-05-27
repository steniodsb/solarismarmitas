import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface Category { id: string; name: string; slug: string; }
interface Size {
  id: string;
  category_id: string;
  label: string;
  ml: number;
  price: number;
  sort_order: number;
  active: boolean;
}

export default function AdminSizes() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Size | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({ label: "", ml: "", price: "", active: true });

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3500);
  };

  useEffect(() => {
    supabase.from("frozen_categories").select("id, name, slug").order("sort_order").then(({ data }) => {
      if (data) {
        setCategories(data);
        if (data.length > 0) setSelectedCatId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCatId) fetchSizes();
  }, [selectedCatId]);

  const fetchSizes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("frozen_sizes")
      .select("*")
      .eq("category_id", selectedCatId)
      .order("sort_order");
    if (!error && data) setSizes(data as Size[]);
    setLoading(false);
  };

  const startCreate = () => {
    setEditing(null);
    setForm({ label: "", ml: "", price: "", active: true });
    setCreating(true);
  };

  const startEdit = (s: Size) => {
    setCreating(false);
    setEditing(s);
    setForm({ label: s.label, ml: String(s.ml), price: String(s.price), active: s.active });
  };

  const cancelForm = () => { setCreating(false); setEditing(null); };

  const handleSave = async () => {
    if (!form.label.trim() || !form.ml || !form.price) {
      showMessage("Todos os campos são obrigatórios.", "error");
      return;
    }
    setSaving(true);

    const payload = {
      label: form.label,
      ml: Number(form.ml),
      price: Number(form.price),
      active: form.active,
    };

    if (editing) {
      const { error } = await supabase.from("frozen_sizes").update(payload).eq("id", editing.id);
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Tamanho atualizado!", "success"); cancelForm(); }
    } else {
      const { error } = await supabase
        .from("frozen_sizes")
        .insert({ ...payload, category_id: selectedCatId, sort_order: sizes.length });
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Tamanho criado!", "success"); cancelForm(); }
    }

    setSaving(false);
    fetchSizes();
  };

  const handleToggleActive = async (s: Size) => {
    const { error } = await supabase.from("frozen_sizes").update({ active: !s.active }).eq("id", s.id);
    if (error) {
      showMessage("Erro ao atualizar: " + error.message, "error");
      return;
    }
    fetchSizes();
  };

  const handleDelete = async (s: Size) => {
    if (!confirm(`Excluir "${s.label}"?`)) return;
    const { error } = await supabase.from("frozen_sizes").delete().eq("id", s.id);
    if (error) showMessage("Erro: " + error.message, "error");
    else { showMessage("Tamanho excluído.", "success"); fetchSizes(); }
  };

  const selectedCatName = categories.find((c) => c.id === selectedCatId)?.name || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-foreground text-lg">Tamanhos & Precos</h2>
          <p className="text-muted-foreground text-sm">Gerencie os tamanhos e precos de cada categoria.</p>
        </div>
        {selectedCatId && (
          <Button variant="cta" size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4" /> Novo tamanho
          </Button>
        )}
      </div>

      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
          {message.text}
        </div>
      )}

      {/* Category selector */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCatId(cat.id); cancelForm(); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              selectedCatId === cat.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Form */}
      {(creating || editing) && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">{editing ? "Editar tamanho" : `Novo tamanho — ${selectedCatName}`}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Label *</label>
              <input
                type="text"
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="Ex: 500ml"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Volume (ml) *</label>
              <input
                type="number"
                value={form.ml}
                onChange={(e) => setForm((f) => ({ ...f, ml: e.target.value }))}
                placeholder="500"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Preco (R$) *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="19.90"
                className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} id="size-active" className="rounded" />
            <label htmlFor="size-active" className="text-sm text-foreground">Ativo</label>
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
      ) : !selectedCatId ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Selecione uma categoria acima.</div>
      ) : sizes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Nenhum tamanho cadastrado em <strong>{selectedCatName}</strong>.</div>
      ) : (
        <div className="space-y-2">
          {sizes.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-4 bg-card border border-border rounded-xl px-4 py-3 transition-all ${!s.active ? "opacity-50" : ""}`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-primary text-sm">{s.ml}<span className="text-[10px]">ml</span></span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{s.label}</p>
                <p className="text-primary font-bold text-sm">R$ {s.price.toFixed(2).replace(".", ",")}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleToggleActive(s)} title={s.active ? "Desativar" : "Ativar"} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  {s.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => startEdit(s)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(s)} title="Excluir" className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
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
