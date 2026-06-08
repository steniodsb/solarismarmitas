import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { optimizeImage } from "@/lib/optimizeImage";

interface Category { id: string; name: string; slug: string; }
interface Flavor {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  active: boolean;
}

export default function AdminFlavors() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>("");
  const [flavors, setFlavors] = useState<Flavor[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Flavor | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", description: "", active: true });

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
    if (selectedCatId) fetchFlavors();
  }, [selectedCatId]);

  const fetchFlavors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("frozen_flavors")
      .select("*")
      .eq("category_id", selectedCatId)
      .order("sort_order");
    if (!error && data) setFlavors(data as Flavor[]);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const optimized = await optimizeImage(file).catch(() => file);
    const ext = optimized.name.split(".").pop();
    const fileName = `flavors/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, optimized, { upsert: false, contentType: optimized.type });

    if (error) {
      showMessage("Erro no upload: " + error.message, "error");
      return null;
    }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const startCreate = () => {
    setEditing(null);
    setForm({ name: "", description: "", active: true });
    setImageFile(null);
    setImagePreview(null);
    setCreating(true);
  };

  const startEdit = (f: Flavor) => {
    setCreating(false);
    setEditing(f);
    setForm({ name: f.name, description: f.description, active: f.active });
    setImageFile(null);
    setImagePreview(f.image_url);
  };

  const cancelForm = () => {
    setCreating(false);
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { showMessage("Nome e obrigatorio.", "error"); return; }
    setSaving(true);

    let imageUrl: string | null = editing?.image_url || null;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
      else { setSaving(false); return; }
    }

    if (editing) {
      const { error } = await supabase
        .from("frozen_flavors")
        .update({ name: form.name, description: form.description, image_url: imageUrl, active: form.active })
        .eq("id", editing.id);
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Sabor atualizado!", "success"); cancelForm(); }
    } else {
      const { error } = await supabase
        .from("frozen_flavors")
        .insert({ category_id: selectedCatId, name: form.name, description: form.description, image_url: imageUrl, active: form.active, sort_order: flavors.length });
      if (error) showMessage("Erro: " + error.message, "error");
      else { showMessage("Sabor criado!", "success"); cancelForm(); }
    }

    setSaving(false);
    fetchFlavors();
  };

  const handleToggleActive = async (f: Flavor) => {
    const { error } = await supabase.from("frozen_flavors").update({ active: !f.active }).eq("id", f.id);
    if (error) {
      showMessage("Erro ao atualizar: " + error.message, "error");
      return;
    }
    fetchFlavors();
  };

  const handleDelete = async (f: Flavor) => {
    if (!confirm(`Excluir "${f.name}"?`)) return;
    if (f.image_url) {
      const path = f.image_url.split("/product-images/").pop();
      if (path) await supabase.storage.from("product-images").remove([path]);
    }
    const { error } = await supabase.from("frozen_flavors").delete().eq("id", f.id);
    if (error) showMessage("Erro: " + error.message, "error");
    else { showMessage("Sabor excluido.", "success"); fetchFlavors(); }
  };

  const selectedCatName = categories.find((c) => c.id === selectedCatId)?.name || "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-foreground text-lg">Sabores / Marmitas</h2>
          <p className="text-muted-foreground text-sm">Gerencie os sabores de cada categoria.</p>
        </div>
        {selectedCatId && (
          <Button variant="cta" size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4" /> Novo sabor
          </Button>
        )}
      </div>

      {message && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-destructive/10 text-destructive border border-destructive/20"}`}>
          {message.text}
        </div>
      )}

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

      {(creating || editing) && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">{editing ? "Editar sabor" : `Novo sabor — ${selectedCatName}`}</h3>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Frango Grelhado com Batata Doce"
              className="w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Descricao</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Descricao do sabor..."
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
                <p className="text-muted-foreground text-xs mt-1">JPG, PNG ou WebP</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} id="flavor-active" className="rounded" />
            <label htmlFor="flavor-active" className="text-sm text-foreground">Ativo</label>
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
      ) : !selectedCatId ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Selecione uma categoria acima.</div>
      ) : flavors.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">Nenhum sabor cadastrado em <strong>{selectedCatName}</strong>.</div>
      ) : (
        <div className="space-y-2">
          {flavors.map((f) => (
            <div key={f.id} className={`flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 transition-all ${!f.active ? "opacity-50" : ""}`}>
              {f.image_url ? (
                <img src={f.image_url} alt={f.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-2xl">🍱</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{f.name}</p>
                <p className="text-muted-foreground text-xs truncate">{f.description || "Sem descricao"}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleToggleActive(f)} title={f.active ? "Desativar" : "Ativar"} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  {f.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => startEdit(f)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(f)} title="Excluir" className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
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
