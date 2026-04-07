import { useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import CartNotification from "@/components/frozen/CartNotification";
import { usePromoLineGallery } from "@/hooks/useFrozenData";
import { useFrozenCart } from "@/contexts/FrozenCartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, ShoppingBag, Check, ChevronLeft, ChevronRight } from "lucide-react";

const lineNames: Record<string, string> = {
  tradicional: "Marmitas Tradicionais",
  vegetariana: "Marmitas Vegetarianas",
  fitness: "Marmitas Fitness",
  "low-carb": "Marmitas Low Carb",
};

const lineDescriptions: Record<string, string> = {
  tradicional:
    "Cardápio bem variado com arroz branco, feijão ou lentilha, acompanhamentos como massa, aipim, purê… Proteína bem sortida (frango, carne, peixe) e legumes variados.\n\nMontamos combinações de sabores bem Mix, prontas em 5min no micro, perfeita pra facilitar o seu dia a dia.",
  vegetariana:
    "Cardápio bem mix com arroz branco ou integral (escrever na observação do pedido sua preferência) feijão ou lentilha, acompanhamentos como massa, batata, aipim, purê… bastante legumes, refogados, seletas sortidas com lasanha de brócolis, panqueca de legumes…\n\nMontamos Marmitas bem variadas sem carnes focado bem nos legumes, comida bem saudável. Prontas em 5 min no micro, para facilitar seu dia a dia.",
  fitness:
    "Cardápio bem mix com arroz integral, feijão ou lentilha, acompanhamentos como massa integral, aipim, purê… Proteína bem sortida (frango, carne ou peixe) e bastante legumes e refogados variados.\n\nMontamos Marmitas bem variadas com propósito mais saudável, ideal para quem está começando dietas e quer cuidar da alimentação. Prontas em 5 min no micro, pensada para facilitar seu dia a dia.",
  "low-carb":
    "Cardápio bem mix focado em bastante legumes, refogados e seletas sortidas com proteínas bem variadas — frango, carne, peixe.\n\nMontamos Marmitas bem variadas com foco para dietas e perda de peso. Prontas em 5 min no micro, pensada para facilitar seu dia a dia.",
};

const lineItems: Record<string, string[]> = {
  tradicional: [
    "Arroz branco", "Feijão", "Lentilha", "Purê / Massa", "Complementos",
    "Seletas", "Legumes", "Refogados", "Frangos variados", "Carnes variadas", "Filé de peixe",
  ],
  vegetariana: [
    "Arroz branco ou integral", "Feijão", "Lentilha", "Purê / Massa", "Complementos",
    "Seletas", "Legumes", "Refogados", "Yakisoba", "Lasanha de brócolis", "Panquecas de legumes",
  ],
  fitness: [
    "Arroz integral", "Batata doce", "Quinoa", "Legumes grelhados", "Brócolis",
    "Espinafre", "Frango grelhado", "Carne magra", "Tilápia / Salmão", "Omelete proteico", "Grão de bico",
  ],
  "low-carb": [
    "Abobrinha", "Berinjela gratinada", "Couve-flor", "Aspargos", "Cogumelos",
    "Brócolis", "Frango grelhado", "Carne moída magra", "Salmão ao forno", "Lombo suíno", "Tomate assado",
  ],
};

interface ComboSize {
  id: string;
  label: string;
  ml: number;
  priceFor10: number;
}

const comboSizes: ComboSize[] = [
  { id: "400", label: "400ml", ml: 400, priceFor10: 159.90 },
  { id: "500", label: "500ml", ml: 500, priceFor10: 189.90 },
  { id: "850", label: "850ml", ml: 850, priceFor10: 259.90 },
];

const quantityOptions = [
  { qty: 10, discount: 0 },
  { qty: 20, discount: 10 },
  { qty: 30, discount: 20 },
];

export default function ComboLinePage() {
  const { lineSlug } = useParams<{ lineSlug: string }>();
  const navigate = useNavigate();
  const galleryRef = useRef<HTMLDivElement>(null);
  const [selectedSize, setSelectedSize] = useState<ComboSize | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(10);

  const { data: galleryImages } = usePromoLineGallery(lineSlug);
  const { addItem, toggleCart, totalItems, totalPrice } = useFrozenCart();
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const dismissNotification = useCallback(() => setCartMessage(null), []);

  const lineName = lineNames[lineSlug || ""] || "Marmitas";
  const lineDescription = lineDescriptions[lineSlug || ""] || "";
  const items = lineItems[lineSlug || ""] || [];

  const getPrice = () => {
    if (!selectedSize) return 0;
    const qtyOption = quantityOptions.find((q) => q.qty === selectedQty);
    const multiplier = selectedQty / 10;
    return selectedSize.priceFor10 * multiplier - (qtyOption?.discount || 0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const unitPrice = getPrice() / selectedQty;

    addItem({
      category: {
        id: `promo-${lineSlug}`,
        name: lineName,
        slug: lineSlug || "",
        description: lineDescription,
        image_url: null,
        sort_order: 0,
      },
      size: {
        id: `promo-${lineSlug}-${selectedSize.id}`,
        category_id: `promo-${lineSlug}`,
        label: selectedSize.label,
        ml: selectedSize.ml,
        price: unitPrice,
        sort_order: 0,
      },
      flavor: {
        id: `promo-${lineSlug}-combo`,
        category_id: `promo-${lineSlug}`,
        name: `Combo ${lineName}`,
        description: `Combo sortido ${lineName.toLowerCase()}`,
        image_url: null,
        sort_order: 0,
      },
      quantity: selectedQty,
      unitPrice,
    });

    setCartMessage(`${selectedQty}x Combo ${lineName} (${selectedSize.label}) adicionado!`);
    setSelectedSize(null);
    setSelectedQty(10);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16 pb-12">
        <div className="gradient-hero py-6 sm:py-8">
          <div className="container px-4">
            <button
              onClick={() => navigate("/montar/promocionais")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-foreground">
              {lineName}
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
              Escolha o tamanho e a quantidade do seu combo
            </p>
          </div>
        </div>

        {/* Gallery carousel */}
        {galleryImages && galleryImages.length > 0 && (
          <section className="py-6 bg-muted/50">
            <div className="relative group">
              <button
                onClick={() => galleryRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={galleryRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-8 pb-2"
              >
                {galleryImages.map((img, i) => (
                  <div
                    key={img.id}
                    className="snap-start shrink-0 w-56 sm:w-72 aspect-square rounded-2xl overflow-hidden bg-muted shadow-md"
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `${lineName} ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => galleryRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                aria-label="Proximo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </section>
        )}

        <div className="container px-4 py-6 sm:py-10">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Description + items */}
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">{lineDescription}</p>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Ingredientes que podem compor seu combo:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Size selection */}
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold text-foreground">1. Escolha o tamanho</h2>
              <div className="grid grid-cols-3 gap-3">
                {comboSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`relative rounded-xl border-2 py-4 px-3 text-center transition-all active:scale-[0.97] ${
                      selectedSize?.id === size.id
                        ? "border-primary bg-accent shadow-md"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {selectedSize?.id === size.id && (
                      <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                    )}
                    <div className="font-display text-2xl sm:text-3xl font-black text-foreground leading-none">
                      {size.ml}
                      <span className="text-xs text-muted-foreground font-normal">ml</span>
                    </div>
                    <div className="text-primary font-bold text-sm mt-1">
                      R$ {size.priceFor10.toFixed(2).replace(".", ",")}
                    </div>
                    <p className="text-muted-foreground text-[10px] mt-0.5">por 10 unidades</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity selection */}
            {selectedSize && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <h2 className="font-display text-lg font-bold text-foreground">2. Escolha a quantidade</h2>
                <div className="grid grid-cols-3 gap-3">
                  {quantityOptions.map((opt) => {
                    const multiplier = opt.qty / 10;
                    const totalPrice = selectedSize.priceFor10 * multiplier - opt.discount;
                    return (
                      <button
                        key={opt.qty}
                        onClick={() => setSelectedQty(opt.qty)}
                        className={`relative rounded-xl border-2 py-4 px-3 text-center transition-all active:scale-[0.97] ${
                          selectedQty === opt.qty
                            ? "border-primary bg-accent shadow-md"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        {selectedQty === opt.qty && (
                          <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                        )}
                        <div className="font-display text-3xl sm:text-4xl font-black text-foreground">{opt.qty}</div>
                        <p className="text-muted-foreground text-sm">unidades</p>
                        {opt.discount > 0 && (
                          <span className="inline-block mt-2 gradient-gold text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                            Desconto de R$ {opt.discount.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                        <div className="text-primary font-bold text-base sm:text-lg mt-2">
                          R$ {totalPrice.toFixed(2).replace(".", ",")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to cart button */}
            {selectedSize && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <Button
                  variant="cta"
                  size="xl"
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Adicionar ao Carrinho — R$ {getPrice().toFixed(2).replace(".", ",")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

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
