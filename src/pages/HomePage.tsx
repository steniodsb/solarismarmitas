import { useRef } from "react";
import { Link } from "react-router-dom";
import { useFrozenCategories, useAllFrozenFlavors, useFrozenSizes } from "@/hooks/useFrozenData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Snowflake, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import carinaPetersen from "@/assets/carina-petersen.jpg";

const categoryEmojis: Record<string, string> = {
  fitness: "💪",
  "low-carb": "🥑",
  caseira: "🏠",
  vegetariana: "🥬",
  sucos: "🧃",
};

const categoryCTAs: Record<string, string> = {
  fitness: "Monte seu combo Fitness",
  "low-carb": "Peça Low Carb agora",
  caseira: "Peça Caseira agora",
  vegetariana: "Monte seu combo Vegetariano",
  sucos: "Peça seus Sucos",
};

function FlavorCarousel({
  categorySlug,
  categoryId,
  flavors,
}: {
  categorySlug: string;
  categoryId: string;
  flavors: { id: string; name: string; description: string; image_url: string | null }[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: sizes } = useFrozenSizes(categoryId);

  const minPrice = sizes?.length ? Math.min(...sizes.map((s) => s.price)) : null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (!flavors.length) return null;

  return (
    <div className="space-y-4">
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 px-1">
          {flavors.map((flavor) => (
            <Link
              key={flavor.id}
              to={`/categoria/${categorySlug}/sabor/${flavor.id}`}
              className="snap-start shrink-0 w-64 group/card rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className="h-40 bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center">
                {flavor.image_url ? (
                  <img src={flavor.image_url} alt={flavor.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl opacity-40">🍱</span>
                )}
              </div>
              <div className="p-4 space-y-1.5">
                <h4 className="font-display font-bold text-foreground text-sm group-hover/card:text-primary transition-colors">
                  {flavor.name}
                </h4>
                <p className="text-muted-foreground text-xs line-clamp-2">{flavor.description}</p>
                {minPrice !== null && (
                  <p className="text-primary font-bold text-sm">
                    A partir de R$ {minPrice.toFixed(2).replace(".", ",")}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card border border-border shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
          aria-label="Próximo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="text-center">
        <Button variant="cta" asChild>
          <Link to={`/montar/${categorySlug}`}>
            {categoryCTAs[categorySlug] || "Faça seu pedido"} <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: categories, isLoading: catLoading } = useFrozenCategories();
  const { data: allFlavors, isLoading: flavLoading } = useAllFrozenFlavors();

  const isLoading = catLoading || flavLoading;

  const flavorsByCategory = (categoryId: string) =>
    (allFlavors || []).filter((f) => f.category_id === categoryId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      {/* Hero */}
      <section className="pt-16">
        <div className="gradient-hero py-16 sm:py-24">
          <div className="container text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 text-primary-foreground/90 text-sm">
              <Snowflake className="h-4 w-4" />
              Marmitas Congeladas
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight">
              Comida de verdade,<br />
              <span className="text-secondary">pronta pra você.</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-lg mx-auto text-lg">
              Escolha sua linha, o tamanho ideal e monte seu combo de marmitas congeladas com os sabores que você mais gosta.
            </p>
            <div className="pt-2">
              <Button variant="cta" size="xl" asChild>
                <Link to="/pedir">Pedir Agora</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category carousels */}
      <section className="py-12 sm:py-16">
        <div className="container space-y-16">
          {isLoading ? (
            <div className="space-y-10">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="h-6 w-40 bg-muted animate-pulse rounded mb-4" />
                  <div className="flex gap-4">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="w-64 h-52 bg-muted animate-pulse rounded-2xl shrink-0" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            categories?.map((cat) => {
              const flavors = flavorsByCategory(cat.id);
              if (!flavors.length) return null;
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{categoryEmojis[cat.slug] || "🍱"}</span>
                      <div>
                        <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">{cat.name}</h2>
                        <p className="text-muted-foreground text-sm hidden sm:block">{cat.description}</p>
                      </div>
                    </div>
                    <Link
                      to={`/categoria/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all"
                    >
                      Ver mais <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <FlavorCarousel categorySlug={cat.slug} categoryId={cat.id} flavors={flavors} />
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Conheça nossa empresa */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={carinaPetersen}
                alt="Carina Petersen, proprietária do Restaurante Solaris, com as marmitas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-5">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Conheça nossa empresa
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Aqui no Restaurante Solaris, cada marmita é preparada como se fosse para a nossa própria família.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Desde 2018, cuidamos de cada detalhe — da escolha dos ingredientes à higienização rigorosa e ao preparo com carinho.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A proprietária Carina Petersen acompanha toda a produção, garantindo qualidade e atenção também na entrega, para que você se sinta verdadeiramente em casa.
              </p>
              <Button variant="ctaOutline" asChild>
                <Link to="/sobre">Saiba mais sobre nós <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted">
        <div className="container">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
            Como funciona?
          </h2>
          <div className="grid sm:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Escolha a linha", desc: "Fitness, Low Carb, Caseira ou Vegetariana" },
              { step: "2", title: "Selecione o tamanho", desc: "400ml, 500ml ou 850ml" },
              { step: "3", title: "Monte seus sabores", desc: "Escolha a quantidade de cada sabor" },
              { step: "4", title: "Finalize pelo WhatsApp", desc: "Receba na sua casa!" },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full gradient-hero text-primary-foreground font-display font-bold text-lg flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
