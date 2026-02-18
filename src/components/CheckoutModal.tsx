import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { CustomerData } from "@/types";

const WHATSAPP_NUMBER = "5511999999999"; // Configure o número aqui

export default function CheckoutModal() {
  const { items, totalPrice, isCheckoutOpen, setCheckoutOpen, clearCart } = useCart();
  const [form, setForm] = useState<CustomerData>({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemsList = items
      .map((i) => `▪ ${i.product.name} x${i.quantity} — R$ ${(i.product.price * i.quantity).toFixed(2).replace(".", ",")}`)
      .join("\n");

    const message = `🍱 *PEDIDO SOLARIS*\n\n` +
      `*Cliente:* ${form.name}\n` +
      `*Telefone:* ${form.phone}\n` +
      `*Endereço:* ${form.address}\n\n` +
      `*Itens do Pedido:*\n${itemsList}\n\n` +
      `*Total: R$ ${totalPrice.toFixed(2).replace(".", ",")}*\n` +
      (form.notes ? `\n*Observações:* ${form.notes}` : "");

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
    setCheckoutOpen(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={() => setCheckoutOpen(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-bounce-in">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="font-display text-xl font-bold text-card-foreground">Finalizar Pedido</h2>
            <button onClick={() => setCheckoutOpen(false)} className="p-2 hover:bg-muted rounded-lg" aria-label="Fechar">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Order summary */}
          <div className="p-5 border-b border-border space-y-2">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Resumo do Pedido</h3>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-card-foreground">{product.name} x{quantity}</span>
                <span className="font-medium text-card-foreground">
                  R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-border font-bold">
              <span className="text-card-foreground">Total</span>
              <span className="text-primary text-lg">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Dados de Entrega</h3>
            <div className="space-y-3">
              <input
                name="name"
                type="text"
                required
                placeholder="Nome completo *"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                name="phone"
                type="tel"
                required
                placeholder="Telefone *"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                name="address"
                type="text"
                required
                placeholder="Endereço completo *"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <textarea
                name="notes"
                placeholder="Observações (opcional)"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <Button variant="cta" size="xl" type="submit" className="w-full">
              <MessageCircle className="h-5 w-5" />
              Enviar Pedido pelo WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
