import { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFrozenCategories, useAllFrozenFlavors, useFrozenSizes, useAllFrozenSizes } from "@/hooks/useFrozenData";
import Header from "@/components/Header";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import SizesSection from "@/components/SizesSection";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categoryEmojis: Record<string, string> = {
  fitness: "💪",
  "low-carb": "🥑",
  caseira: "🏠",
  vegetariana: "🥬",
  sucos: "🧃",
  promocionais: "🔥",
};

const categoryCTAs: Record<string, string> = {
  fitness: "Monte seu combo Fitness",
  "low-carb": "Peça Low Carb agora",
  caseira: "Peça Caseira agora",
  vegetariana: "Monte seu combo Vegetariano",
  sucos: "Peça seus Sucos",
  promocionais: "Aproveite as promoções",
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
              to={categorySlug === "promocionais" ? "/montar/promocionais" : `/montar/${categorySlug}`}
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
          <Link to={categorySlug === "promocionais" ? "/montar/promocionais" : `/montar/${categorySlug}`}>
            {categoryCTAs[categorySlug] || "Faça seu pedido"} <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderCategoriesPage() {
  const { data: categories, isLoading: catLoading } = useFrozenCategories();
  const { data: allFlavors, isLoading: flavLoading } = useAllFrozenFlavors();
  const { data: allSizes } = useAllFrozenSizes();
  const navigate = useNavigate();

  const isLoading = catLoading || flavLoading;

  const flavorsByCategory = (categoryId: string) =>
    (allFlavors || []).filter((f) => f.category_id === categoryId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16">
        <div className="gradient-hero py-6 sm:py-8">
          <div className="container px-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Início
            </button>
            <h1 className="font-display text-xl sm:text-3xl font-bold text-primary-foreground">
              Escolha sua linha
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm sm:text-base">Selecione a categoria para montar seu pedido</p>
          </div>
        </div>

        <SizesSection />

        <div className="container px-4 py-8 sm:py-12">
          <div className="space-y-16">
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
                if (!flavors.length && cat.slug !== "promocionais") return null;
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
                      {cat.slug !== "promocionais" && (
                        <Link
                          to={`/montar/${cat.slug}`}
                          className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all"
                        >
                          Ver mais <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                    {flavors.length > 0 ? (
                      <FlavorCarousel categorySlug={cat.slug} categoryId={cat.id} flavors={flavors} />
                    ) : cat.slug === "promocionais" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories
                          ?.filter((c) => !["promocionais", "sucos"].includes(c.slug) && flavorsByCategory(c.id).length > 0)
                          .map((promoCat) => {
                            const catSizes = allSizes?.filter((s) => s.category_id === promoCat.id);
                            const minPrice = catSizes?.length ? Math.min(...catSizes.map((s) => s.price)) : null;
                            return (
                              <Link
                                key={promoCat.id}
                                to={`/montar/${promoCat.slug}`}
                                className="group/promo bg-card border border-border rounded-2xl p-5 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col gap-3"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{categoryEmojis[promoCat.slug] || "🍱"}</span>
                                  <h3 className="font-display font-bold text-foreground group-hover/promo:text-primary transition-colors">
                                    {promoCat.name}
                                  </h3>
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-2 flex-1">{promoCat.description}</p>
                                {minPrice !== null && (
                                  <p className="text-primary font-bold text-sm">
                                    A partir de R$ {minPrice.toFixed(2).replace(".", ",")}
                                  </p>
                                )}
                                <span className="inline-flex items-center gap-1 text-primary font-semibold text-sm group-hover/promo:gap-2 transition-all">
                                  Montar combo <ArrowRight className="h-4 w-4" />
                                </span>
                              </Link>
                            );
                          })}
                      </div>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>


      </main>
    </div>
  );
}
