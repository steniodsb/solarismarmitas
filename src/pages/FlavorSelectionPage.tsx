import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFrozenCategories, useFrozenSizes, useFrozenFlavors } from "@/hooks/useFrozenData";
import { useFrozenCart } from "@/contexts/FrozenCartContext";
import Header from "@/components/Header";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import CartNotification from "@/components/frozen/CartNotification";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart, Check, X, ShoppingBag } from "lucide-react";

interface FlavorSelection {
  sizeId: string;
  quantity: number;
}

export default function FlavorSelectionPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { addItem, toggleCart, totalItems, totalPrice } = useFrozenCart();

  const { data: categories } = useFrozenCategories();
  const category = categories?.find((c) => c.slug === categorySlug);
  const { data: sizes } = useFrozenSizes(category?.id);
  const { data: flavors, isLoading } = useFrozenFlavors(category?.id);

  const isJuice = categorySlug === "sucos";

  const [activeFlavor, setActiveFlavor] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, FlavorSelection>>({});
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const dismissNotification = useCallback(() => setCartMessage(null), []);

  const selectSize = (flavorId: string, sizeId: string) => {
    setSelections((prev) => ({
      ...prev,
      [flavorId]: { sizeId, quantity: prev[flavorId]?.quantity || 1 },
    }));
  };

  const updateQty = (flavorId: string, delta: number) => {
    setSelections((prev) => {
      const current = prev[flavorId];
      if (!current) return prev;
      const next = Math.max(1, current.quantity + delta);
      return { ...prev, [flavorId]: { ...current, quantity: next } };
    });
  };

  const addFlavorToCart = (flavorId: string) => {
    const sel = selections[flavorId];
    if (!sel || !category) return;
    const size = sizes?.find((s) => s.id === sel.sizeId);
    const flavor = flavors?.find((f) => f.id === flavorId);
    if (!size || !flavor) return;

    addItem({
      category,
      size,
      flavor,
      quantity: sel.quantity,
      unitPrice: size.price,
    });
    setCartMessage(`${sel.quantity}x ${flavor.name} (${size.label}) adicionado!`);
    setSelections((prev) => {
      const { [flavorId]: _, ...rest } = prev;
      return rest;
    });
    setActiveFlavor(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16 pb-24">
        <div className="gradient-hero py-6 sm:py-8">
          <div className="container px-4">
            <button
              onClick={() => navigate(isJuice ? "/" : "/pedir")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-foreground">
              {category?.name || "..."}
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
              Escolha o sabor, o tamanho e adicione ao carrinho
            </p>
          </div>
        </div>

        <div className="container px-4 py-4 sm:py-8">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-3">
              {flavors?.map((flavor) => {
                const isOpen = activeFlavor === flavor.id;
                const sel = selections[flavor.id];
                const selectedSize = sel ? sizes?.find((s) => s.id === sel.sizeId) : null;

                return (
                  <div
                    key={flavor.id}
                    className={`rounded-xl border-2 transition-all overflow-hidden ${
                      isOpen
                        ? "border-primary bg-card shadow-lg"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    {/* Flavor row */}
                    <button
                      onClick={() => setActiveFlavor(isOpen ? null : flavor.id)}
                      className="flex items-center gap-3 p-3 sm:p-4 w-full text-left"
                    >
                      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {flavor.image_url ? (
                          <img src={flavor.image_url} alt={flavor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-2xl opacity-30">🍱</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">{flavor.name}</h3>
                        {flavor.description && (
                          <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">{flavor.description}</p>
                        )}
                        {sizes && sizes.length > 0 && (
                          <p className="text-primary text-xs font-semibold mt-1">
                            A partir de R$ {Math.min(...sizes.map((s) => s.price)).toFixed(2).replace(".", ",")}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {isOpen ? (
                          <X className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Plus className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>

                    {/* Size picker (expanded) */}
                    {isOpen && sizes && sizes.length > 0 && (
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        <div className="border-t border-border pt-3">
                          <p className="text-sm font-semibold text-foreground mb-2">Escolha o tamanho:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {sizes.map((size, idx) => {
                              const isPopular = idx === 1 && sizes.length > 2;
                              const isSelected = sel?.sizeId === size.id;
                              return (
                                <button
                                  key={size.id}
                                  onClick={() => selectSize(flavor.id, size.id)}
                                  className={`relative rounded-xl border-2 py-3 px-2 text-center transition-all ${
                                    isSelected
                                      ? "border-primary bg-accent shadow-md"
                                      : "border-border bg-card hover:border-primary/40"
                                  }`}
                                >
                                  {isPopular && (
                                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 gradient-gold text-secondary-foreground text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                      Mais vendido
                                    </span>
                                  )}
                                  {isSelected && (
                                    <Check className="absolute top-1.5 right-1.5 h-3.5 w-3.5 text-primary" />
                                  )}
                                  <div className="font-display text-xl sm:text-2xl font-black text-foreground leading-none">
                                    {size.ml}
                                    <span className="text-[10px] text-muted-foreground font-normal">ml</span>
                                  </div>
                                  <div className="font-display text-base sm:text-lg font-bold text-primary mt-1">
                                    R$ {size.price.toFixed(2).replace(".", ",")}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quantity + Add to cart */}
                        {sel && selectedSize && (
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border">
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-sm text-muted-foreground">Qtd:</span>
                              <button
                                onClick={() => updateQty(flavor.id, -1)}
                                className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-6 text-center font-bold text-foreground text-lg">{sel.quantity}</span>
                              <button
                                onClick={() => updateQty(flavor.id, 1)}
                                className="w-9 h-9 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-colors active:scale-95"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            <Button
                              variant="cta"
                              className="flex-1 sm:flex-none h-11"
                              onClick={() => addFlavorToCart(flavor.id)}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Adicionar — R$ {(selectedSize.price * sel.quantity).toFixed(2).replace(".", ",")}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <button
          onClick={toggleCart}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-auto z-40 flex items-center justify-center gap-3 gradient-hero text-primary-foreground px-5 py-3.5 rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div className="text-left">
            <p className="text-xs opacity-80">Ver carrinho</p>
            <p className="font-display font-bold text-sm">R$ {totalPrice.toFixed(2).replace(".", ",")}</p>
          </div>
        </button>
      )}

      <CartNotification message={cartMessage} onDismiss={dismissNotification} />
    </div>
  );
}
