import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { ArrowLeft } from "lucide-react";
import MixPromoSection from "@/components/MixPromoSection";

export default function PromotionalPage() {
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
              onClick={() => navigate("/pedir")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-foreground">
              Combos Promocionais
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">
              Escolha o tipo de combo e monte seu pedido!
            </p>
          </div>
        </div>

        <MixPromoSection />
      </main>

      <Footer />
    </div>
  );
}
