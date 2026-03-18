import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFrozenCart } from "@/contexts/FrozenCartContext";

export default function FrozenCartSidebar() {
  const { items, isOpen, setCartOpen, totalPrice, updateQuantity, removeItem, setCheckoutOpen } = useFrozenCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={() => setCartOpen(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-card-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Seu Carrinho
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <ShoppingBag className="h-12 w-12" />
              <p>Seu carrinho está vazio</p>
              <Button variant="cta" onClick={() => setCartOpen(false)}>Montar Pedido</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-muted rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-card-foreground">{item.flavor.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{item.category.name}</span>
                    <span className="text-[10px] bg-secondary/10 text-secondary-foreground px-1.5 py-0.5 rounded">{item.size.label}</span>
                  </div>
                  <p className="font-bold text-primary text-sm mt-1">
                    R$ {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remover">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors" aria-label="Diminuir">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors" aria-label="Aumentar">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Total:</span>
              <span className="font-display text-2xl font-black text-primary">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Button variant="cta" size="lg" className="w-full" onClick={handleCheckout}>
              Finalizar Pedido
            </Button>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
