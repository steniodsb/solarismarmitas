import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFrozenFlavorBySlug } from "@/hooks/useFrozenData";
import { useFrozenCart } from "@/contexts/FrozenCartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ShoppingCart, Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export default function FlavorDetailPage() {
  const { categorySlug, flavorId } = useParams<{ categorySlug: string; flavorId: string }>();
  const { category, flavor, sizes, flavors, isLoading } = useFrozenFlavorBySlug(categorySlug, flavorId);
  const { addItem, toggleCart } = useFrozenCart();

  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const minPrice = sizes?.length ? Math.min(...sizes.map((s) => s.price)) : null;

  // Other flavors from same category (excluding current)
  const otherFlavors = flavors?.filter((f) => f.id !== flavorId)?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container py-20">
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="h-64 bg-muted animate-pulse rounded-2xl" />
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
          <div className="container py-20 text-center">
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

      <main className="pt-16">
        <div className="gradient-hero py-6">
          <div className="container">
            <Link
              to={`/categoria/${categorySlug}`}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> {category.name}
            </Link>
          </div>
        </div>

        <div className="container py-10">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent aspect-square flex items-center justify-center">
                {flavor.image_url ? (
                  <img src={flavor.image_url} alt={flavor.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl opacity-30">🍱</span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6 flex flex-col justify-center">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {category.name}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
                  {flavor.name}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {flavor.description}
                </p>

                {minPrice !== null && (
                  <div className="bg-muted rounded-xl p-4">
                    <p className="text-sm text-muted-foreground">A partir de</p>
                    <p className="font-display text-3xl font-black text-primary">
                      R$ {minPrice.toFixed(2).replace(".", ",")}
                      <span className="text-sm font-normal text-muted-foreground ml-1">/ unidade</span>
                    </p>
                    {sizes && sizes.length > 1 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {sizes.map((s) => (
                          <span key={s.id} className="text-xs bg-card border border-border px-3 py-1.5 rounded-lg">
                            {s.label}: <strong>R$ {s.price.toFixed(2).replace(".", ",")}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="cta"
                  size="xl"
                  className="w-full sm:w-auto"
                  onClick={() => setShowSizePicker(true)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Pedir Este Sabor
                </Button>

                {/* Size picker inline */}
                {showSizePicker && sizes && sizes.length > 0 && (
                  <div className="bg-muted rounded-xl p-5 space-y-4 animate-in slide-in-from-bottom-2">
                    <h4 className="font-display font-bold text-foreground">Escolha o tamanho</h4>
                    <div className="flex flex-col gap-2">
                      {sizes.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSizeId(s.id)}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                            selectedSizeId === s.id
                              ? "border-primary bg-accent"
                              : "border-border bg-card hover:border-primary/30"
                          }`}
                        >
                          <span className="font-semibold text-foreground">{s.label}</span>
                          <span className="text-primary font-bold">R$ {s.price.toFixed(2).replace(".", ",")}</span>
                          {selectedSizeId === s.id && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))}
                    </div>

                    {selectedSizeId && (
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">Qtd:</span>
                          <button
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                            className="w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-foreground">{quantity}</span>
                          <button
                            onClick={() => setQuantity((q) => q + 1)}
                            className="w-8 h-8 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <Button
                          variant="cta"
                          onClick={() => {
                            const size = sizes.find((s) => s.id === selectedSizeId);
                            if (!size || !category || !flavor) return;
                            addItem({
                              category,
                              size,
                              flavor,
                              quantity,
                              unitPrice: size.price,
                            });
                            toast.success(`${quantity}x ${flavor.name} adicionado ao carrinho!`);
                            setShowSizePicker(false);
                            setSelectedSizeId(null);
                            setQuantity(1);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Adicionar — R$ {((sizes.find((s) => s.id === selectedSizeId)?.price || 0) * quantity).toFixed(2).replace(".", ",")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Other flavors */}
            {otherFlavors.length > 0 && (
              <div className="mt-16">
                <h2 className="font-display text-xl font-bold text-foreground mb-6">
                  Outros sabores de {category.name}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {otherFlavors.map((f) => (
                    <Link
                      key={f.id}
                      to={`/categoria/${categorySlug}/sabor/${f.id}`}
                      className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
                    >
                      <div className="h-28 bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
                        {f.image_url ? (
                          <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl opacity-30">🍱</span>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {f.name}
                        </h4>
                        <p className="text-muted-foreground text-xs line-clamp-1 mt-0.5">{f.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
