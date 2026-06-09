import { useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useFrozenFlavorBySlug } from "@/hooks/useFrozenData";
import { useFrozenCart } from "@/contexts/FrozenCartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import CartNotification from "@/components/frozen/CartNotification";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShoppingCart, ShoppingBag, Check, Minus, Plus } from "lucide-react";
import size400 from "@/assets/size-400ml.webp";
import size500 from "@/assets/size-500ml.webp";
import size850 from "@/assets/size-850ml.webp";

const sizeImages: Record<number, string> = { 400: size400, 500: size500, 850: size850 };

export default function FlavorDetailPage() {
  const { categorySlug, flavorId } = useParams<{ categorySlug: string; flavorId: string }>();
  const { category, flavor, sizes, flavors, isLoading } = useFrozenFlavorBySlug(categorySlug, flavorId);
  const { addItem, toggleCart, totalItems, totalPrice } = useFrozenCart();

  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const dismissNotification = useCallback(() => setCartMessage(null), []);

  const otherFlavors = flavors?.filter((f) => f.id !== flavorId)?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container px-4 py-10">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="h-48 sm:h-64 bg-muted animate-pulse rounded-2xl" />
              <div className="h-8 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!flavor || !category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container px-4 py-20 text-center">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">Sabor não encontrado</h1>
            <Button variant="ctaOutline" asChild>
              <Link to="/">Voltar ao início</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16 pb-24">
        {/* Breadcrumb */}
        <div className="gradient-hero py-4 sm:py-6">
          <div className="container px-4">
            <Link
              to={`/categoria/${categorySlug}`}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {category.name}
            </Link>
          </div>
        </div>

        <div className="container px-4 py-6 sm:py-10">
          <div className="max-w-3xl mx-auto">
            {/* Image — full width on mobile */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent aspect-[4/3] sm:aspect-[16/9] mb-6">
              {flavor.image_url ? (
                <img loading="lazy" decoding="async" src={flavor.image_url} alt={flavor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <span className="text-8xl opacity-30">🍱</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                {category.name}
              </span>
              <h1 className="font-display text-2xl sm:text-4xl font-black text-foreground">
                {flavor.name}
              </h1>
              <p className="text-muted-foreground text-base leading-relaxed">
                {flavor.description}
              </p>

              {/* Size selection */}
              {sizes && sizes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-display font-bold text-foreground">Escolha o tamanho</h4>
                  <div className="space-y-2">
                    {sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setSelectedSizeId(s.id); setQuantity(1); }}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all w-full active:scale-[0.98] ${
                          selectedSizeId === s.id
                            ? "border-primary bg-primary/5"
                            : "border-border bg-card hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {sizeImages[s.ml] && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                              <img loading="lazy" decoding="async" src={sizeImages[s.ml]} alt={`${s.ml}ml`} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <span className="font-display text-lg font-black text-foreground">
                            {s.ml}<span className="text-xs text-muted-foreground font-normal">ml</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold text-base">R$ {s.price.toFixed(2).replace(".", ",")}</span>
                          {selectedSizeId === s.id && <Check className="h-5 w-5 text-primary" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Quantity + Add to cart — stacked on mobile */}
                  {selectedSizeId && (
                    <div className="flex flex-col gap-3 pt-3">
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-sm text-muted-foreground">Quantidade:</span>
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted active:scale-95 transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-foreground text-xl">{quantity}</span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-10 h-10 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Button
                        variant="cta"
                        size="xl"
                        className="w-full h-12"
                        onClick={() => {
                          const size = sizes.find((s) => s.id === selectedSizeId);
                          if (!size || !category || !flavor) return;
                          addItem({ category, size, flavor, quantity, unitPrice: size.price });
                          setCartMessage(`${quantity}x ${flavor.name} adicionado ao carrinho!`);
                          setSelectedSizeId(null);
                          setQuantity(1);
                        }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        Adicionar — R$ {((sizes.find((s) => s.id === selectedSizeId)?.price || 0) * quantity).toFixed(2).replace(".", ",")}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* More flavors button + preview */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  Outros sabores de {category.name}
                </h2>
                <Button variant="ctaOutline" size="sm" asChild>
                  <Link to={`/montar/${categorySlug}`}>
                    Mais sabores <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
              {otherFlavors.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {otherFlavors.map((f) => (
                    <Link
                      key={f.id}
                      to={`/categoria/${categorySlug}/sabor/${f.id}`}
                      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all active:scale-[0.98]"
                    >
                      <div className="h-24 sm:h-28 bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
                        {f.image_url ? (
                          <img loading="lazy" decoding="async" src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl opacity-30">🍱</span>
                        )}
                      </div>
                      <div className="p-2.5">
                        <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                          {f.name}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating cart button — full-width bar on mobile */}
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
      <Footer />
    </div>
  );
}
