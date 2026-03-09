import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { ArrowLeft, MapPin, Truck } from "lucide-react";

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
  "Eldorado",
  "Estância Velha",
];

export default function AreaAtendimentoPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16 pb-12">
        <div className="gradient-hero py-6 sm:py-8">
          <div className="container px-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Início
            </button>
            <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-foreground flex items-center gap-2">
              <MapPin className="h-6 w-6" /> Área de Atendimento
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
              Confira as cidades onde realizamos entregas
            </p>
          </div>
        </div>

        <div className="container px-4 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {cities.map((city) => (
                <div
                  key={city}
                  className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3"
                >
                  <Truck className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm font-medium">{city}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-accent border border-primary/20 rounded-2xl p-5 text-center">
              <p className="text-accent-foreground font-medium text-sm">
                📦 Demais localizações podemos entregar com agendamento.
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Entre em contato pelo WhatsApp para combinar a entrega.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
