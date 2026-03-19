import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import MixPromoSection from "@/components/MixPromoSection";
import { usePromoGallery } from "@/hooks/useFrozenData";

export default function PromotionalPage() {
  const navigate = useNavigate();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { data: gallery } = usePromoGallery();

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

        {/* Galeria de fotos — carrossel */}
        {gallery && gallery.length > 0 && (
          <section className="py-10 sm:py-14 bg-muted/50">
            <div className="container px-4 mb-6">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground text-center">
                Galeria de Marmitas
              </h2>
              <p className="text-muted-foreground text-sm text-center mt-1">
                Veja exemplos das combinações que preparamos nos combos sortidos
              </p>
            </div>
            <div className="relative group">
              <button
                onClick={() => galleryRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div
                ref={galleryRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-8 pb-2"
              >
                {gallery.map((img, i) => (
                  <div
                    key={img.id}
                    className="snap-start shrink-0 w-56 sm:w-72 aspect-square rounded-2xl overflow-hidden bg-muted shadow-md"
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `Marmita ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => galleryRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card"
                aria-label="Próximo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
