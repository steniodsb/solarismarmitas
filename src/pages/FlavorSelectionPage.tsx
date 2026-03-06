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

  // Track which flavor has the size picker open
  const [activeFlavor, setActiveFlavor] = useState<string | null>(null);
  // Track selections per flavor: { flavorId: { sizeId, quantity } }
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
    // Reset this flavor
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

      <main className="pt-16">
        <div className="gradient-hero py-8">
          <div className="container">
            <button
              onClick={() => navigate(isJuice ? "/" : "/pedir")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
              {category?.name || "..."}
            </h1>
            <p className="text-primary-foreground/70 mt-2">
              Escolha o sabor, o tamanho e adicione ao carrinho
            </p>
          </div>
        </div>

        <div className="container py-8">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
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
                      className="flex items-center gap-4 p-4 w-full text-left"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {flavor.image_url ? (
                          <img src={flavor.image_url} alt={flavor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-2xl opacity-30">🍱</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base">{flavor.name}</h3>
                        {flavor.description && (
                          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 line-clamp-1">{flavor.description}</p>
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
                      <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                        <div className="border-t border-border pt-4">
                          <p className="text-sm font-semibold text-foreground mb-3">Escolha o tamanho:</p>
                          <div className="grid grid-cols-3 gap-3">
                            {sizes.map((size, idx) => {
                              const isPopular = idx === 1 && sizes.length > 2;
                              const isSelected = sel?.sizeId === size.id;
                              return (
                                <button
                                  key={size.id}
                                  onClick={() => selectSize(flavor.id, size.id)}
                                  className={`relative rounded-xl border-2 p-4 text-center transition-all ${
                                    isSelected
                                      ? "border-primary bg-accent shadow-md"
                                      : "border-border bg-card hover:border-primary/40"
                                  }`}
                                >
                                  {isPopular && (
                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 gradient-gold text-secondary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                      Mais vendido
                                    </span>
                                  )}
                                  <div className="font-display text-2xl sm:text-3xl font-black text-foreground">
                                    {size.ml}
                                    <span className="text-xs text-muted-foreground font-normal">ml</span>
                                  </div>
                                  <div className="text-muted-foreground text-[10px] mb-2">{size.label}</div>
                                  <div className="font-display text-lg sm:text-xl font-bold text-primary">
                                    R$ {size.price.toFixed(2).replace(".", ",")}
                                  </div>
                                  <p className="text-muted-foreground text-[10px]">por unidade</p>
                                  {isSelected && (
                                    <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quantity + Add to cart */}
                        {sel && selectedSize && (
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">Qtd:</span>
                              <button
                                onClick={() => updateQty(flavor.id, -1)}
                                className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-bold text-foreground">{sel.quantity}</span>
                              <button
                                onClick={() => updateQty(flavor.id, 1)}
                                className="w-8 h-8 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <Button
                              variant="cta"
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
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 gradient-hero text-primary-foreground px-5 py-4 rounded-2xl shadow-2xl hover:scale-105 transition-transform"
        >
          <div className="relative">
            <ShoppingBag className="h-6 w-6" />
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
