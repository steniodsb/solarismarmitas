import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, MessageCircle, Home, Instagram, Facebook } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/hooks/useAnalytics";

interface OrderState {
  customerName?: string;
  total?: number;
  itemsCount?: number;
  transactionId?: string;
}

const WHATSAPP_NUMBER = "5551989173813";

export default function ObrigadoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as OrderState) || {};
  const { customerName, total, itemsCount, transactionId } = state;

  useEffect(() => {
    // Sem dados de pedido (acesso direto a URL): volta pra home
    if (!total || !transactionId) {
      const t = setTimeout(() => navigate("/"), 100);
      return () => clearTimeout(t);
    }

    // Backup dos eventos de conversao (caso o disparo do modal tenha sido bloqueado)
    const w = window as unknown as {
      fbq?: (...args: unknown[]) => void;
      gtag?: (...args: unknown[]) => void;
      ttq?: { track: (event: string, data: Record<string, unknown>) => void };
    };
    try {
      w.fbq?.("track", "Purchase", {
        value: total,
        currency: "BRL",
        num_items: itemsCount,
        order_id: transactionId,
      });
    } catch { /* ignore */ }
    try {
      w.gtag?.("event", "purchase", {
        transaction_id: transactionId,
        value: total,
        currency: "BRL",
      });
    } catch { /* ignore */ }
    try {
      w.ttq?.track("CompletePayment", {
        value: total,
        currency: "BRL",
        order_id: transactionId,
      });
    } catch { /* ignore */ }

    trackEvent("order_confirmation_view", "/obrigado", {
      total,
      items_count: itemsCount,
      transaction_id: transactionId,
    });
  }, [total, transactionId, itemsCount, navigate]);

  if (!total || !transactionId) {
    return null;
  }

  const formattedTotal = total.toFixed(2).replace(".", ",");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-16">
        <div className="container px-4 py-10 sm:py-16">
          <div className="max-w-xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
                Pedido enviado{customerName ? `, ${customerName.split(" ")[0]}` : ""}!
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg">
                Recebemos seu pedido e em breve entraremos em contato pelo WhatsApp
                para combinar Dia/Horário de entrega e forma de pagamento.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3 text-left">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                Resumo
              </h2>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Itens no pedido</span>
                <span className="font-semibold text-foreground">{itemsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-primary text-lg">R$ {formattedTotal}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Nº do pedido</span>
                <span className="font-mono">{transactionId.slice(-8).toUpperCase()}</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              <p className="font-semibold mb-1">Não recebeu a mensagem no WhatsApp?</p>
              <p>
                Sem problemas — abra novamente clicando no botão abaixo. O pedido
                continua o mesmo.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 mt-3 text-amber-900 font-semibold hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> Abrir conversa no WhatsApp
              </a>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Acompanhe a Solaris nas redes:</p>
              <div className="flex justify-center gap-3">
                <a
                  href="https://www.instagram.com/solaris.marmitas"
                  target="_blank"
                  rel="noopener"
                  className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-foreground" />
                </a>
                <a
                  href="https://www.facebook.com/solaris.marmitas"
                  target="_blank"
                  rel="noopener"
                  className="w-11 h-11 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-foreground" />
                </a>
              </div>
            </div>

            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link to="/">
                <Home className="h-4 w-4" /> Voltar para o início
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
