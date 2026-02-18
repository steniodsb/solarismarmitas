import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { toast } from "sonner";

export default function PromoSection() {
  const { addItem } = useCart();

  const handleCombo = () => {
    const fitmeal = products.find((p) => p.id === "fitmeal");
    if (fitmeal) {
      for (let i = 0; i < 10; i++) addItem(fitmeal);
      toast.success("Combo 10 marmitas adicionado ao carrinho!");
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="relative rounded-2xl gradient-hero overflow-hidden p-8 sm:p-12 text-center space-y-4 shadow-red">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgY3g9IjIwIiBjeT0iMjAiIHI9IjIiLz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 bg-secondary/20 rounded-full px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">Promoção!</span>
            </div>
            <h3 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground">
              COMBO 10 MARMITAS
            </h3>
            <p className="text-primary-foreground/60 line-through text-lg">De R$ 199,00</p>
            <p className="font-display text-5xl sm:text-6xl font-black text-secondary">
              R$ 149,90
            </p>
            <p className="text-primary-foreground/80">Economia de quase R$ 50! Aproveite!</p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="cta" size="xl" onClick={handleCombo}>
                Comprar Combo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
