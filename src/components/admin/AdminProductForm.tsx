import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Loader2, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string | null;
  onClose: () => void;
}

interface SizeInput { id: string; label: string; priceModifier: number }
interface FlavorInput { id: string; label: string }

export default function AdminProductForm({ productId, onClose }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!productId;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Fit");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [sizes, setSizes] = useState<SizeInput[]>([]);
  const [flavors, setFlavors] = useState<FlavorInput[]>([]);
  const [active, setActive] = useState(true);
  const [available, setAvailable] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!productId) return;
    (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      if (error || !data) { toast.error("Erro ao carregar produto"); onClose(); return; }
      setName(data.name);
      setDescription(data.description);
      setPrice(String(data.price));
      setCategory(data.category);
      setIngredients(Array.isArray(data.ingredients) && data.ingredients.length > 0 ? (data.ingredients as string[]) : [""]);
      setSizes(Array.isArray(data.sizes) ? (data.sizes as unknown as SizeInput[]) : []);
      setFlavors(Array.isArray(data.flavors) ? (data.flavors as unknown as FlavorInput[]) : []);
      setActive(data.active);
      setAvailable(data.available);
      setSortOrder(String(data.sort_order));
      setImageUrl(data.image_url || "");
      setFetching(false);
    })();
  }, [productId]);

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl || null;
    const ext = imageFile.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, imageFile);
    if (error) { toast.error("Erro ao enviar imagem"); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const uploadedUrl = await uploadImage();

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      ingredients: ingredients.filter((i) => i.trim()) as unknown as null,
      sizes: sizes as unknown as null,
      flavors: flavors as unknown as null,
      active,
      available,
      sort_order: parseInt(sortOrder) || 0,
      image_url: uploadedUrl,
    };

    if (isEdit) {
      const { error } = await supabase.from("products").update(payload).eq("id", productId);
      if (error) { toast.error("Erro ao atualizar produto"); setLoading(false); return; }
      toast.success("Produto atualizado!");
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast.error("Erro ao criar produto"); setLoading(false); return; }
      toast.success("Produto criado!");
    }
    queryClient.invalidateQueries({ queryKey: ["products"] });
    setLoading(false);
    onClose();
  };

  if (fetching) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={onClose} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>
      <h2 className="font-display text-xl font-bold text-foreground">{isEdit ? "Editar Produto" : "Novo Produto"}</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nome *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Categoria *</label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Descrição</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Preço (R$) *</label>
            <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Ordem</label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
          <div className="space-y-3 pt-6">
            <label className="flex items-center gap-2 text-sm"><Switch checked={active} onCheckedChange={setActive} /> Ativo</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={available} onCheckedChange={setAvailable} /> Disponível</label>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Imagem</label>
          <div className="flex items-center gap-4">
            {(imageUrl || imageFile) && (
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                alt="Preview"
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground hover:bg-accent transition-colors">
              <Upload className="h-4 w-4" /> Enviar imagem
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ingredientes</label>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={ing}
                onChange={(e) => { const arr = [...ingredients]; arr[i] = e.target.value; setIngredients(arr); }}
                placeholder={`Ingrediente ${i + 1}`}
              />
              {ingredients.length > 1 && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setIngredients(ingredients.filter((_, j) => j !== i))}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setIngredients([...ingredients, ""])}>
            <Plus className="h-3 w-3" /> Ingrediente
          </Button>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Tamanhos</label>
          {sizes.map((s, i) => (
            <div key={i} className="flex gap-2">
              <Input value={s.id} onChange={(e) => { const arr = [...sizes]; arr[i] = { ...s, id: e.target.value }; setSizes(arr); }} placeholder="ID (ex: p)" className="w-20" />
              <Input value={s.label} onChange={(e) => { const arr = [...sizes]; arr[i] = { ...s, label: e.target.value }; setSizes(arr); }} placeholder="Label (ex: Pequena 300g)" />
              <Input type="number" step="0.01" value={s.priceModifier} onChange={(e) => { const arr = [...sizes]; arr[i] = { ...s, priceModifier: parseFloat(e.target.value) || 0 }; setSizes(arr); }} placeholder="+R$" className="w-24" />
              <Button type="button" variant="ghost" size="icon" onClick={() => setSizes(sizes.filter((_, j) => j !== i))}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setSizes([...sizes, { id: "", label: "", priceModifier: 0 }])}>
            <Plus className="h-3 w-3" /> Tamanho
          </Button>
        </div>

        {/* Flavors */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Sabores</label>
          {flavors.map((f, i) => (
            <div key={i} className="flex gap-2">
              <Input value={f.id} onChange={(e) => { const arr = [...flavors]; arr[i] = { ...f, id: e.target.value }; setFlavors(arr); }} placeholder="ID (ex: frango)" className="w-28" />
              <Input value={f.label} onChange={(e) => { const arr = [...flavors]; arr[i] = { ...f, label: e.target.value }; setFlavors(arr); }} placeholder="Label (ex: Frango Grelhado)" />
              <Button type="button" variant="ghost" size="icon" onClick={() => setFlavors(flavors.filter((_, j) => j !== i))}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => setFlavors([...flavors, { id: "", label: "" }])}>
            <Plus className="h-3 w-3" /> Sabor
          </Button>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="cta" size="lg" type="submit" disabled={loading} className="flex-1">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isEdit ? "Salvar Alterações" : "Criar Produto"}
          </Button>
          <Button variant="outline" size="lg" type="button" onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
