import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function CartSidebar() {
  const { items, isOpen, setCartOpen, totalPrice, updateQuantity, removeItem, setCheckoutOpen } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={() => setCartOpen(false)} />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-display text-lg font-bold text-card-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Seu Carrinho
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <ShoppingBag className="h-12 w-12" />
              <p>Seu carrinho está vazio</p>
              <Button variant="cta" onClick={() => setCartOpen(false)}>
                Ver Cardápio
              </Button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-3 bg-muted rounded-xl p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-card-foreground truncate">{product.name}</h4>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <p className="font-bold text-primary text-sm mt-1">
                    R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(product.id)} className="text-muted-foreground hover:text-destructive transition-colors" aria-label="Remover">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
                      aria-label="Diminuir"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
                      aria-label="Aumentar"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Total:</span>
              <span className="font-display text-2xl font-black text-primary">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <Button
              variant="cta"
              size="lg"
              className="w-full animate-pulse-gold"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
            >
              Finalizar Pedido
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
