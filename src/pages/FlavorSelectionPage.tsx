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
import size400 from "@/assets/size-400ml.webp";
import size500 from "@/assets/size-500ml.webp";
import size850 from "@/assets/size-850ml.webp";

const sizeImages: Record<number, string> = { 400: size400, 500: size500, 850: size850 };

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

  // For sucos, auto-select the single 300ml size when opening a flavor
  const juiceSize = isJuice ? sizes?.[0] : null;

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
              {isJuice
                ? "Sucos naturais em embalagens de 300ml para congelamento"
                : "Escolha o sabor, o tamanho e adicione ao carrinho"}
            </p>
          </div>
        </div>

        {/* Size reference strip — only for non-juice */}
        {!isJuice && sizes && sizes.length > 0 && (
          <div className="container px-4 pt-4 sm:pt-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-semibold text-muted-foreground mb-3">Tamanhos disponíveis:</p>
              <div className="flex gap-3">
                {sizes.map((size) => {
                  const img = sizeImages[size.ml];
                  return (
                    <div key={size.id} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                      {img && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img loading="lazy" decoding="async" src={img} alt={`${size.ml}ml`} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div className="font-display font-black text-foreground text-sm leading-none">{size.label}</div>
                        <div className="text-primary font-bold text-xs mt-0.5">R$ {size.price.toFixed(2).replace(".", ",")}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
                      onClick={() => {
                        const opening = !isOpen;
                        setActiveFlavor(opening ? flavor.id : null);
                        // Auto-select size for juice
                        if (opening && isJuice && juiceSize && !selections[flavor.id]) {
                          setSelections((prev) => ({
                            ...prev,
                            [flavor.id]: { sizeId: juiceSize.id, quantity: 1 },
                          }));
                        }
                      }}
                      className="flex items-center gap-3 p-3 sm:p-4 w-full text-left"
                    >
                      <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {flavor.image_url ? (
                          <img loading="lazy" decoding="async" src={flavor.image_url} alt={flavor.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-2xl opacity-30">🍱</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">{flavor.name}</h3>
                        {flavor.description && (
                          <p className="text-muted-foreground text-xs mt-0.5 whitespace-pre-wrap break-words">{flavor.description}</p>
                        )}
                        {sizes && sizes.length > 0 && (
                          <p className="text-primary text-xs font-semibold mt-1">
                            {isJuice
                              ? `R$ ${sizes[0].price.toFixed(2).replace(".", ",")} — 300ml`
                              : `A partir de R$ ${Math.min(...sizes.map((s) => s.price)).toFixed(2).replace(".", ",")}`}
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
                        {/* Hide size picker for sucos — auto-selected */}
                        {!isJuice && (
                          <div className="border-t border-border pt-3">
                            <p className="text-sm font-semibold text-foreground mb-2">Escolha o tamanho:</p>
                            <div className="grid grid-cols-3 gap-2">
                              {sizes.map((size) => {
                                const isSelected = sel?.sizeId === size.id;
                                return (
                                  <button
                                    key={size.id}
                                    onClick={() => selectSize(flavor.id, size.id)}
                                    className={`relative rounded-xl border-2 overflow-hidden text-center transition-all ${
                                      isSelected
                                        ? "border-primary bg-accent shadow-md"
                                        : "border-border bg-card hover:border-primary/40"
                                    }`}
                                  >
                                    {isSelected && (
                                      <Check className="absolute top-1.5 right-1.5 z-10 h-3.5 w-3.5 text-primary" />
                                    )}
                                    {sizeImages[size.ml] && (
                                      <div className="aspect-square w-full">
                                        <img loading="lazy" decoding="async" src={sizeImages[size.ml]} alt={`${size.ml}ml`} className="w-full h-full object-cover" />
                                      </div>
                                    )}
                                    <div className="py-2 px-1">
                                      <div className="font-display text-base sm:text-lg font-black text-foreground leading-none">
                                        {size.ml}<span className="text-[10px] text-muted-foreground font-normal">ml</span>
                                      </div>
                                      <div className="font-bold text-primary text-xs sm:text-sm mt-0.5">
                                        R$ {size.price.toFixed(2).replace(".", ",")}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* For sucos, show price info */}
                        {isJuice && juiceSize && (
                          <div className="border-t border-border pt-3">
                            <p className="text-sm text-muted-foreground">
                              300ml — <span className="text-primary font-bold">R$ {juiceSize.price.toFixed(2).replace(".", ",")}</span> cada
                            </p>
                          </div>
                        )}

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
