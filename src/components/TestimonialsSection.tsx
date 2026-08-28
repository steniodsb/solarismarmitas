import { useState } from "react";
import { useTestimonials } from "@/hooks/useFrozenData";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * "Quem prova, aprova" — carrossel com os prints de conversa que os clientes
 * mandam no WhatsApp. As artes já vêm prontas do marketing e têm proporções
 * diferentes (quadrada e retrato), por isso a altura é fixa e a largura
 * acompanha a imagem (object-contain) em vez de recortar.
 *
 * O texto dos prints fica pequeno no card, então clicar abre a imagem inteira.
 */
export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useTestimonials();
  const [aberta, setAberta] = useState<string | null>(null);

  // Sem depoimentos cadastrados a seção some — o painel controla isso.
  if (!isLoading && (!testimonials || testimonials.length === 0)) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="container px-4">
        <div className="text-center mb-8 space-y-1">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            O que nossos clientes dizem
          </h2>
          <p className="text-muted-foreground text-sm">
            Quem prova, aprova — mensagens reais que recebemos no WhatsApp
          </p>
        </div>

        {isLoading ? (
          <div className="flex gap-4 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] sm:h-[460px] w-[240px] sm:w-[320px] rounded-2xl bg-muted animate-pulse shrink-0"
              />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{ align: "start", loop: testimonials!.length > 2 }}
            className="max-w-5xl mx-auto"
          >
            <CarouselContent className="ml-0 py-1">
              {testimonials!.map((t) => (
                <CarouselItem key={t.id} className="basis-auto pl-0 pr-4">
                  <button
                    type="button"
                    onClick={() => setAberta(t.image_url)}
                    aria-label="Ampliar depoimento"
                    className="flex items-center justify-center w-auto min-w-[200px] sm:min-w-[240px] h-[320px] sm:h-[460px] rounded-2xl overflow-hidden border border-border bg-card shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={t.image_url}
                      alt={t.alt_text ?? "Depoimento de cliente"}
                      className="h-full w-auto object-contain"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden lg:flex -left-14 h-10 w-10 bg-background shadow-md" />
            <CarouselNext className="hidden lg:flex -right-14 h-10 w-10 bg-background shadow-md" />
          </Carousel>
        )}

        <p className="text-center text-muted-foreground text-xs mt-4 sm:hidden">
          Arraste para o lado para ver mais →
        </p>
      </div>

      <Dialog open={!!aberta} onOpenChange={(open) => !open && setAberta(null)}>
        <DialogContent className="max-w-3xl w-[95vw] p-2 sm:p-3 bg-background">
          <DialogTitle className="sr-only">Depoimento de cliente</DialogTitle>
          {aberta && (
            <img
              src={aberta}
              alt="Depoimento de cliente"
              className="w-full max-h-[85vh] object-contain rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
