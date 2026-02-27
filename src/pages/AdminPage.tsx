import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { useStoreConfig } from "@/hooks/useStoreConfig";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  LogOut, Plus, Pencil, Trash2, Package, Settings, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import logoSolaris from "@/assets/logo-solaris.webp";
import AdminProductForm from "@/components/admin/AdminProductForm";
import AdminStoreConfig from "@/components/admin/AdminStoreConfig";

type Tab = "products" | "settings";

export default function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate("/admin/login", { replace: true });
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-primary shadow-red">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoSolaris} alt="Solaris" className="h-8" />
            <span className="font-display font-bold text-primary-foreground text-sm">Admin</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="container flex gap-1">
          <button
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" /> Produtos
          </button>
          <button
            onClick={() => setTab("settings")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "settings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" /> Configurações
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6">
        {tab === "products" ? <AdminProducts /> : <AdminStoreConfig />}
      </div>
    </div>
  );
}

function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const handleToggleAvailable = async (id: string, available: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ available: !available })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar disponibilidade");
    } else {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(!available ? "Produto disponível" : "Produto marcado como esgotado");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ active: !active })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir produto");
    } else {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto excluído");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (showCreate || editingId) {
    return (
      <AdminProductForm
        productId={editingId}
        onClose={() => { setEditingId(null); setShowCreate(false); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Produtos ({products?.length || 0})</h2>
        <Button variant="cta" size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="grid gap-3">
        {products?.map((p) => (
          <div key={p.id} className={`bg-card rounded-xl border border-border p-4 flex items-center gap-4 ${!p.active ? "opacity-50" : ""}`}>
            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-card-foreground truncate">{p.name}</h3>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{p.category}</span>
                {!p.available && <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">Esgotado</span>}
              </div>
              <p className="text-sm text-muted-foreground truncate">{p.description}</p>
              <p className="text-sm font-bold text-primary">R$ {p.price.toFixed(2).replace(".", ",")}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex flex-col items-center gap-1">
                <Switch checked={p.available} onCheckedChange={() => handleToggleAvailable(p.id, p.available)} />
                <span className="text-[10px] text-muted-foreground">Estoque</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Switch checked={p.active} onCheckedChange={() => handleToggleActive(p.id, p.active)} />
                <span className="text-[10px] text-muted-foreground">Ativo</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditingId(p.id)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
