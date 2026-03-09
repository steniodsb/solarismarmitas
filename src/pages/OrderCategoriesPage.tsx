import { useNavigate } from "react-router-dom";
import { useFrozenCategories } from "@/hooks/useFrozenData";
import Header from "@/components/Header";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
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
  promocionais: catFitness, // placeholder
};

const categoryEmojis: Record<string, string> = {
  fitness: "💪",
  "low-carb": "🥑",
  caseira: "🏠",
  vegetariana: "🥬",
  sucos: "🧃",
  promocionais: "🔥",
};

export default function OrderCategoriesPage() {
  const { data: categories, isLoading } = useFrozenCategories();
  const navigate = useNavigate();

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

        <div className="container px-4 py-6 sm:py-10">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-48 sm:h-64 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(cat.slug === "promocionais" ? "/montar/promocionais" : `/montar/${cat.slug}`)}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl h-48 sm:h-64 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={categoryImages[cat.slug] || catFitness}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{categoryEmojis[cat.slug] || "🍱"}</span>
                    <h3 className="font-display text-lg sm:text-2xl font-bold text-primary-foreground leading-tight">{cat.name}</h3>
                    <p className="text-primary-foreground/70 text-xs sm:text-sm mt-1 line-clamp-2">{cat.description}</p>
                    <div className="mt-2 sm:mt-3 inline-flex items-center gap-2 text-secondary font-semibold text-xs sm:text-sm group-hover:gap-3 transition-all">
                      Escolher <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
