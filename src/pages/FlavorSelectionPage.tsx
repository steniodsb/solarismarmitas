import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useFrozenCategories, useFrozenSizes, useFrozenFlavors } from "@/hooks/useFrozenData";
import { useFrozenCart } from "@/contexts/FrozenCartContext";
import Header from "@/components/Header";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

export default function FlavorSelectionPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchParams] = useSearchParams();
  const sizeId = searchParams.get("size");
  const navigate = useNavigate();
  const { addItem, toggleCart } = useFrozenCart();

  const { data: categories } = useFrozenCategories();
  const category = categories?.find((c) => c.slug === categorySlug);
  const { data: sizes } = useFrozenSizes(category?.id);
  const selectedSize = sizes?.find((s) => s.id === sizeId) || sizes?.[0];
  const { data: flavors, isLoading } = useFrozenFlavors(category?.id);

  const isJuice = categorySlug === "sucos";

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const totalSelected = Object.values(quantities).reduce((a, b) => a + b, 0);

  const updateQty = (flavorId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[flavorId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [flavorId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [flavorId]: next };
    });
  };

  const handleAddToCart = () => {
    if (!category || !selectedSize) return;
    let added = 0;
    Object.entries(quantities).forEach(([flavorId, qty]) => {
      if (qty <= 0) return;
      const flavor = flavors?.find((f) => f.id === flavorId);
      if (!flavor) return;
      addItem({
        category,
        size: selectedSize,
        flavor,
        quantity: qty,
        unitPrice: selectedSize.price,
      });
      added += qty;
    });
    if (added > 0) {
      toast.success(`${added} ${added === 1 ? "item adicionado" : "itens adicionados"} ao carrinho!`);
      setQuantities({});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16">
        <div className="gradient-hero py-8">
          <div className="container">
            <button
              onClick={() => {
                if (isJuice) navigate("/");
                else navigate(`/montar/${categorySlug}/tamanho`);
              }}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
              {category?.name || "..."}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              {selectedSize && (
                <span className="bg-primary-foreground/10 text-primary-foreground text-sm px-3 py-1 rounded-full">
                  {selectedSize.label} — R$ {selectedSize.price.toFixed(2).replace(".", ",")} / un
                </span>
              )}
            </div>
            <p className="text-primary-foreground/70 mt-2">Escolha os sabores e quantidades</p>
          </div>
        </div>

        <div className="container py-8">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-3">
              {flavors?.map((flavor) => {
                const qty = quantities[flavor.id] || 0;
                const isSelected = qty > 0;
                return (
                  <div
                    key={flavor.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-accent"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    {isSelected && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">{flavor.name}</h3>
                      {flavor.description && (
                        <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 line-clamp-1">{flavor.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQty(flavor.id, -1)}
                        disabled={qty === 0}
                        className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-colors"
                        aria-label="Diminuir"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-bold text-foreground">{qty}</span>
                      <button
                        onClick={() => updateQty(flavor.id, 1)}
                        className="w-8 h-8 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-colors"
                        aria-label="Aumentar"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Floating add-to-cart bar */}
      {totalSelected > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl p-4">
          <div className="container flex items-center justify-between gap-4 max-w-2xl mx-auto">
            <div>
              <p className="font-semibold text-foreground text-sm">
                {totalSelected} {totalSelected === 1 ? "item" : "itens"}
              </p>
              {selectedSize && (
                <p className="text-primary font-display font-bold text-lg">
                  R$ {(totalSelected * selectedSize.price).toFixed(2).replace(".", ",")}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="cta" size="lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
