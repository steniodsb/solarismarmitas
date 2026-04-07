import { useState } from "react";
import { X, MessageCircle, ArrowLeft, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFrozenCart } from "@/contexts/FrozenCartContext";

type Step = "form" | "summary";

interface FormData {
  name: string;
  phone: string;
  address: string;
  notes: string;
  deliveryMode: "delivery" | "pickup";
}

const WHATSAPP_NUMBER = "5551989173813";

export default function FrozenCheckoutModal() {
  const { items, totalPrice, isCheckoutOpen, setCheckoutOpen, clearCart } = useFrozenCart();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>({
    name: "", phone: "", address: "", notes: "", deliveryMode: "delivery",
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => { setCheckoutOpen(false); setStep("form"); };
  const handleReview = (e: React.FormEvent) => { e.preventDefault(); setStep("summary"); };

  const handleSend = () => {
    const itemsList = items
      .map((i) => `▪️ ${i.flavor.name} x${i.quantity} (${i.category.name} · ${i.size.label}) — R$ ${(i.unitPrice * i.quantity).toFixed(2).replace(".", ",")}`)
      .join("\n");

    const deliveryLabel = form.deliveryMode === "delivery" ? "🚚 Entrega" : "🏪 Retirada";
    const message =
      `🍱 *PEDIDO SOLARIS — CONGELADOS*\n\n` +
      `👤 *Cliente:* ${form.name.trim()}\n📱 *Telefone:* ${form.phone.trim()}\n` +
      `${form.deliveryMode === "delivery" ? `📍 *Endereço:* ${form.address.trim()}\n` : ""}${deliveryLabel}\n\n` +
      `*━━━ Itens do Pedido ━━━*\n${itemsList}\n\n` +
      `💰 *Total: R$ ${totalPrice.toFixed(2).replace(".", ",")}*\n` +
      (form.notes.trim() ? `\n📝 *Observações:* ${form.notes.trim()}` : "");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    clearCart();
    handleClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-foreground/40 z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-bounce-in">
          <div className="flex items-center justify-between p-5 border-b border-border">
            {step === "summary" ? (
              <button onClick={() => setStep("form")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
            ) : (
              <h2 className="font-display text-xl font-bold text-card-foreground">Finalizar Pedido</h2>
            )}
            <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg" aria-label="Fechar"><X className="h-5 w-5" /></button>
          </div>

          {step === "form" ? (
            <form onSubmit={handleReview} className="p-5 space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Dados de Entrega</h3>
              <div className="flex gap-2">
                <button type="button" onClick={() => setForm({ ...form, deliveryMode: "delivery" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${form.deliveryMode === "delivery" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}>
                  <MapPin className="h-4 w-4" /> Entrega
                </button>
                <button type="button" onClick={() => setForm({ ...form, deliveryMode: "pickup" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${form.deliveryMode === "pickup" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/50"}`}>
                  <Store className="h-4 w-4" /> Retirada
                </button>
              </div>
              <div className="space-y-3">
                <input name="name" type="text" required placeholder="Nome completo *" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input name="phone" type="tel" required placeholder="Telefone / WhatsApp *" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                {form.deliveryMode === "delivery" && (
                  <input name="address" type="text" required placeholder="Endereço completo *" value={form.address} onChange={handleChange} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                )}
                <textarea name="notes" placeholder="Observações (opcional)" value={form.notes} onChange={handleChange} rows={3} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              {form.deliveryMode === "delivery" && (
                <p className="text-xs text-muted-foreground text-center bg-muted rounded-lg px-3 py-2">
                  O valor da entrega será calculado de acordo com o endereço e informado na finalização do pedido.
                </p>
              )}
              <Button variant="cta" size="xl" type="submit" className="w-full">Revisar Pedido</Button>
            </form>
          ) : (
            <div className="p-5 space-y-4">
              <h3 className="font-display text-lg font-bold text-card-foreground text-center">📋 Resumo do Pedido</h3>
              <div className="bg-muted rounded-xl p-4 space-y-1 text-sm">
                <p><span className="font-semibold">👤</span> {form.name}</p>
                <p><span className="font-semibold">📱</span> {form.phone}</p>
                {form.deliveryMode === "delivery" && <p><span className="font-semibold">📍</span> {form.address}</p>}
                <p><span className="font-semibold">{form.deliveryMode === "delivery" ? "🚚" : "🏪"}</span> {form.deliveryMode === "delivery" ? "Entrega" : "Retirada no local"}</p>
                {form.notes && <p><span className="font-semibold">📝</span> {form.notes}</p>}
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Itens</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <span className="text-card-foreground">{item.flavor.name} x{item.quantity}</span>
                      <span className="text-muted-foreground text-xs ml-1">({item.category.name} · {item.size.label})</span>
                    </div>
                    <span className="font-medium text-card-foreground">R$ {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border font-bold">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary text-lg">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center bg-muted rounded-lg px-3 py-2">
                Entraremos em contato pelo WhatsApp informado para combinar melhor horário de entrega e ver forma de pagamento desejada.
              </p>
              <Button variant="cta" size="xl" className="w-full" onClick={handleSend}>
                <MessageCircle className="h-5 w-5" /> Enviar Pedido pelo WhatsApp
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
