import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFrozenCart } from "@/contexts/FrozenCartContext";
import { trackEvent } from "@/hooks/useAnalytics";

type Step = "form" | "summary";

interface FormData {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

const WHATSAPP_NUMBER = "5551989173813";

export default function FrozenCheckoutModal() {
  const navigate = useNavigate();
  const { items, totalPrice, isCheckoutOpen, setCheckoutOpen, clearCart } = useFrozenCart();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>({
    name: "", phone: "", address: "", notes: "",
  });

  if (!isCheckoutOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClose = () => { setCheckoutOpen(false); setStep("form"); };
  const handleReview = (e: React.FormEvent) => { e.preventDefault(); setStep("summary"); };

  const handleSend = () => {
    const transactionId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const itemsCount = items.reduce((s, i) => s + i.quantity, 0);
    const orderTotal = totalPrice;
    const customerName = form.name.trim();
    const itemsList = items
      .map((i) => {
        const head = `▪️ *${i.flavor.name}* x${i.quantity} (${i.category.name} · ${i.size.label}) — R$ ${(i.unitPrice * i.quantity).toFixed(2).replace(".", ",")}`;
        const desc = i.flavor.description?.trim();
        return desc ? `${head}\n   _${desc}_` : head;
      })
      .join("\n\n");

    const message =
      `🍱 *PEDIDO SOLARIS — CONGELADOS*\n\n` +
      `👤 *Cliente:* ${form.name.trim()}\n📱 *Telefone:* ${form.phone.trim()}\n` +
      `📍 *Endereço:* ${form.address.trim()}\n🚚 Entrega\n\n` +
      `*━━━ Itens do Pedido ━━━*\n${itemsList}\n\n` +
      `💰 *Total: R$ ${totalPrice.toFixed(2).replace(".", ",")}*\n` +
      (form.notes.trim() ? `\n📝 *Observações:* ${form.notes.trim()}` : "");

    trackEvent("whatsapp_order", window.location.pathname, {
      total: totalPrice,
      items_count: items.length,
      delivery_mode: "delivery",
    });

    // Conversao Meta Pixel (Purchase)
    const w = window as unknown as {
      fbq?: (...args: unknown[]) => void;
      gtag?: (...args: unknown[]) => void;
      ttq?: { track: (event: string, data: Record<string, unknown>) => void };
    };
    const contents = items.map((i) => ({
      id: i.flavor.id,
      quantity: i.quantity,
      item_price: i.unitPrice,
    }));
    try {
      w.fbq?.("track", "Purchase", {
        value: totalPrice,
        currency: "BRL",
        contents,
        content_type: "product",
        num_items: items.reduce((s, i) => s + i.quantity, 0),
      });
    } catch { /* pixel pode nao estar carregado */ }

    // Conversao Google Analytics (purchase)
    try {
      w.gtag?.("event", "purchase", {
        transaction_id: transactionId,
        value: totalPrice,
        currency: "BRL",
        items: items.map((i) => ({
          item_id: i.flavor.id,
          item_name: i.flavor.name,
          item_category: i.category.name,
          item_variant: i.size.label,
          price: i.unitPrice,
          quantity: i.quantity,
        })),
      });
    } catch { /* gtag pode nao estar carregado */ }

    // Conversao TikTok Pixel (CompletePayment)
    try {
      w.ttq?.track("CompletePayment", {
        value: totalPrice,
        currency: "BRL",
        contents,
      });
    } catch { /* tiktok pixel pode nao estar carregado */ }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    clearCart();
    setCheckoutOpen(false);
    setStep("form");
    navigate("/obrigado", {
      state: {
        customerName,
        total: orderTotal,
        itemsCount,
        transactionId,
      },
    });
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
              <div className="space-y-3">
                <input name="name" type="text" required placeholder="Nome completo *" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input name="phone" type="tel" required placeholder="Telefone / WhatsApp *" value={form.phone} onChange={handleChange} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input name="address" type="text" required placeholder="Endereço completo *" value={form.address} onChange={handleChange} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <textarea name="notes" placeholder="Observações (opcional)" value={form.notes} onChange={handleChange} rows={3} className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <p className="text-xs text-muted-foreground text-center bg-muted rounded-lg px-3 py-2">
                O valor da entrega será calculado de acordo com o endereço e informado na finalização do pedido.
              </p>
              <Button variant="cta" size="xl" type="submit" className="w-full">Revisar Pedido</Button>
            </form>
          ) : (
            <div className="p-5 space-y-4">
              <h3 className="font-display text-lg font-bold text-card-foreground text-center">📋 Resumo do Pedido</h3>
              <div className="bg-muted rounded-xl p-4 space-y-1 text-sm">
                <p><span className="font-semibold">👤</span> {form.name}</p>
                <p><span className="font-semibold">📱</span> {form.phone}</p>
                <p><span className="font-semibold">📍</span> {form.address}</p>
                <p><span className="font-semibold">🚚</span> Entrega</p>
                {form.notes && <p><span className="font-semibold">📝</span> {form.notes}</p>}
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Itens</h4>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-3 text-sm">
                    <div className="flex-1 min-w-0">
                      <div>
                        <span className="text-card-foreground">{item.flavor.name} x{item.quantity}</span>
                        <span className="text-muted-foreground text-xs ml-1">({item.category.name} · {item.size.label})</span>
                      </div>
                      {item.flavor.description && (
                        <p className="text-muted-foreground text-xs mt-0.5 whitespace-pre-wrap break-words">{item.flavor.description}</p>
                      )}
                    </div>
                    <span className="font-medium text-card-foreground shrink-0">R$ {(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border font-bold">
                  <span className="text-card-foreground">Total</span>
                  <span className="text-primary text-lg">R$ {totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center bg-muted rounded-lg px-3 py-2">
                Entraremos em contato pelo WhatsApp para combinar Dia/Horário de entrega e ver forma de pagamento desejada.
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
