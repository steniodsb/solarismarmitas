import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { addOns } from "@/data/products";
import { toast } from "sonner";

export default function UpsellModal() {
  const { isUpsellOpen, setUpsellOpen, setCheckoutOpen, addItem } = useCart();

  if (!isUpsellOpen) return null;

  const handleAddOn = (addon: typeof addOns[0]) => {
    addItem({ ...addon, category: "Add-on", ingredients: [], active: true, available: true } as any);
    toast.success(`${addon.name} adicionado!`);
  };

  const handleSkip = () => {
    setUpsellOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={handleSkip} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg animate-bounce-in">
          <div className="p-6 text-center border-b border-border">
            <p className="text-3xl mb-2">🍹</p>
            <h2 className="font-display text-xl font-bold text-card-foreground">Que tal complementar?</h2>
            <p className="text-sm text-muted-foreground mt-1">Adicione algo especial ao seu pedido!</p>
          </div>

          <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
            {addOns.map((addon) => (
              <div key={addon.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                <img src={addon.image} alt={addon.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-card-foreground">{addon.name}</h4>
                  <p className="text-xs text-muted-foreground">{addon.description}</p>
                  <p className="font-bold text-primary text-sm mt-0.5">R$ {addon.price.toFixed(2).replace(".", ",")}</p>
                </div>
                <Button variant="cta" size="sm" onClick={() => handleAddOn(addon)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-border flex gap-3">
            <Button variant="ctaOutline" className="flex-1" onClick={handleSkip}>
              Não, obrigado
            </Button>
            <Button variant="cta" className="flex-1" onClick={() => { setUpsellOpen(false); setCheckoutOpen(true); }}>
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
