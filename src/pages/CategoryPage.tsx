import { Link, useParams } from "react-router-dom";
import { useFrozenCategories, useFrozenFlavors, useFrozenSizes } from "@/hooks/useFrozenData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

import catFitness from "@/assets/cat-fitness.jpg";
import catLowcarb from "@/assets/cat-lowcarb.jpg";
import catCaseira from "@/assets/cat-caseira.jpg";
import catVegetariana from "@/assets/cat-vegetariana.jpg";
import catSucos from "@/assets/cat-sucos.jpg";

const categoryImages: Record<string, string> = {
  fitness: catFitness,
  "low-carb": catLowcarb,
  caseira: catCaseira,
  vegetariana: catVegetariana,
  sucos: catSucos,
};

export default function CategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: categories } = useFrozenCategories();
  const category = categories?.find((c) => c.slug === categorySlug);
  const { data: flavors, isLoading } = useFrozenFlavors(category?.id);
  const { data: sizes } = useFrozenSizes(category?.id);

  const minPrice = sizes?.length ? Math.min(...sizes.map((s) => s.price)) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16">
        {/* Hero banner */}
        <div className="relative h-40 sm:h-64 overflow-hidden">
          <img
            src={category?.image_url || categoryImages[categorySlug || ""] || catFitness}
            alt={category?.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-foreground/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 container">
            <Link to="/" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-2 transition-colors w-fit">
              <ArrowLeft className="h-4 w-4" /> Início
            </Link>
            <h1 className="font-display text-2xl sm:text-4xl font-black text-primary-foreground">
              {category?.name || "..."}
            </h1>
            <p className="text-primary-foreground/70 mt-1 max-w-md text-sm sm:text-base">{category?.description}</p>
            {minPrice !== null && (
              <p className="text-secondary font-semibold text-sm mt-1">
                A partir de R$ {minPrice.toFixed(2).replace(".", ",")} / unidade
              </p>
            )}
          </div>
        </div>

        {/* Flavors grid */}
        <div className="container px-4 py-6 sm:py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground">
              Sabores disponíveis
            </h2>
            <Button variant="cta" size="sm" asChild>
              <Link to={`/montar/${categorySlug}`}>
                Pedir <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 sm:h-64 bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {flavors?.map((flavor) => (
                <Link
                  key={flavor.id}
                  to={`/categoria/${categorySlug}/sabor/${flavor.id}`}
                  className="group rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300 active:scale-[0.98]"
                >
                  <div className="h-28 sm:h-44 bg-gradient-to-br from-primary/10 to-accent flex items-center justify-center overflow-hidden">
                    {flavor.image_url ? (
                      <img src={flavor.image_url} alt={flavor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-4xl sm:text-6xl opacity-30">🍱</span>
                    )}
                  </div>
                  <div className="p-3 sm:p-5 space-y-1 sm:space-y-2">
                    <h3 className="font-display font-bold text-foreground group-hover:text-primary transition-colors text-sm sm:text-base leading-tight">
                      {flavor.name}
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{flavor.description}</p>
                    <span className="inline-flex items-center gap-1 text-primary text-xs sm:text-sm font-semibold group-hover:gap-2 transition-all">
                      Ver detalhes <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
