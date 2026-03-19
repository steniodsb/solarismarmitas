import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Check, ChevronLeft, ChevronRight } from "lucide-react";

const WHATSAPP_NUMBER = "5551989173813";

const lineNames: Record<string, string> = {
  tradicional: "Marmitas Tradicionais",
  vegetariana: "Marmitas Vegetarianas",
  fitness: "Marmitas Fitness",
  "low-carb": "Marmitas Low Carb",
};

const lineDescriptions: Record<string, string> = {
  tradicional:
    "Refeições completas com arroz, feijão, carnes variadas, complementos e legumes — o sabor caseiro de todo dia.",
  vegetariana:
    "Refeições sem carne, com proteínas vegetais, legumes, massas e grãos — sabor e nutrição sem abrir mão do prazer.",
  fitness:
    "Refeições com foco em proteína e baixo carboidrato — ideais para quem treina e cuida da alimentação.",
  "low-carb":
    "Refeições sem arroz e sem massa, com legumes grelhados, proteínas nobres e ingredientes funcionais.",
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
  const [selectedSize, setSelectedSize] = useState<ComboSize | null>(null);
  const [selectedQty, setSelectedQty] = useState<number>(10);
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const lineName = lineNames[lineSlug || ""] || "Marmitas";
  const lineDescription = lineDescriptions[lineSlug || ""] || "";
  const items = lineItems[lineSlug || ""] || [];

  const getPrice = () => {
    if (!selectedSize) return 0;
    const qtyOption = quantityOptions.find((q) => q.qty === selectedQty);
    const multiplier = selectedQty / 10;
    return selectedSize.priceFor10 * multiplier - (qtyOption?.discount || 0);
  };

  const handleSendWhatsApp = () => {
    if (!selectedSize || !name.trim() || !phone.trim()) return;
    const price = getPrice();
    const qtyOption = quantityOptions.find((q) => q.qty === selectedQty);
    const message =
      `🔥 *PEDIDO SOLARIS — COMBO ${lineName.toUpperCase()}*\n\n` +
      `👤 *Cliente:* ${name.trim()}\n📱 *Telefone:* ${phone.trim()}\n\n` +
      `*━━━ ${lineName} ━━━*\n` +
      `📦 ${selectedQty} unidades de ${selectedSize.label}\n` +
      (qtyOption && qtyOption.discount > 0
        ? `🎉 Desconto: -R$ ${qtyOption.discount.toFixed(2).replace(".", ",")}\n`
        : "") +
      `💰 *Total: R$ ${price.toFixed(2).replace(".", ",")}*\n` +
      (notes.trim() ? `\n📝 *Observações/Alergias/Preferências:* ${notes.trim()}` : "");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
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
                        <div className="font-display text-2xl font-black text-foreground">{opt.qty}</div>
                        <p className="text-muted-foreground text-xs">unidades</p>
                        {opt.discount > 0 && (
                          <span className="inline-block mt-1 gradient-gold text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -R$ {opt.discount.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                        <div className="text-primary font-bold text-sm mt-1">
                          R$ {totalPrice.toFixed(2).replace(".", ",")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customer info + notes */}
            {selectedSize && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <h2 className="font-display text-lg font-bold text-foreground">3. Seus dados</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nome completo *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="tel"
                    placeholder="Telefone / WhatsApp *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <textarea
                    placeholder="Observações, alergias ou preferências (opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                <Button
                  variant="cta"
                  size="xl"
                  className="w-full"
                  disabled={!name.trim() || !phone.trim()}
                  onClick={handleSendWhatsApp}
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar Pedido — R$ {getPrice().toFixed(2).replace(".", ",")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
