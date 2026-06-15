import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { ArrowLeft, MapPin, CheckCircle2, Truck, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "5551989173813";

const cities = [
  "Porto Alegre",
  "Gravataí",
  "Cachoeirinha",
  "Canoas",
  "Sapucaia",
  "Esteio",
  "São Leopoldo",
  "Novo Hamburgo",
  "Nova Santa Rita",
  "Alvorada",
  "Viamão",
  "Guaíba",
  "Eldorado do Sul",
];

export default function AreaAtendimentoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16 pb-16">
        {/* Hero */}
        <div className="gradient-hero py-10 sm:py-14">
          <div className="container px-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Início
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/15 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl sm:text-4xl font-bold text-primary-foreground">
                Área de Atendimento
              </h1>
            </div>
            <p className="text-primary-foreground/70 text-sm sm:text-base max-w-lg">
              Entregamos marmitas congeladas em {cities.length} cidades da Região Metropolitana de Porto Alegre.
            </p>
          </div>
        </div>

        <div className="container px-4 py-10 sm:py-14 space-y-10">

          {/* City grid */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
                Cidades com entrega regular
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {cities.map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-4 py-3 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-foreground text-sm font-medium">{city}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Other locations banner */}
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center shrink-0">
                  <Truck className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-display font-bold text-foreground text-base sm:text-lg">
                    Sua cidade não está na lista?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Demais localizações podemos entregar com agendamento. Entre em contato pelo WhatsApp e combinamos a entrega!
                  </p>
                </div>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de saber se vocês entregam na minha cidade.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="cta" className="whitespace-nowrap">
                    <MessageCircle className="h-4 w-4" />
                    Falar no WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* CTA pedido */}
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <p className="text-muted-foreground text-sm">Pronto pra pedir? Monte seu combo agora.</p>
            <Button variant="cta" size="lg" asChild>
              <Link to="/pedir">
                Ver cardápio completo <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
