import { useNavigate, useParams } from "react-router-dom";
import { useFrozenCategories, useFrozenSizes } from "@/hooks/useFrozenData";
import Header from "@/components/Header";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import { ArrowLeft, Check } from "lucide-react";

export default function SizeSelectionPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const { data: categories } = useFrozenCategories();
  const category = categories?.find((c) => c.slug === categorySlug);
  const { data: sizes, isLoading } = useFrozenSizes(category?.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16">
        <div className="gradient-hero py-8">
          <div className="container">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
              {category?.name || "..."}
            </h1>
            <p className="text-primary-foreground/70 mt-1">Escolha o tamanho da sua marmita</p>
          </div>
        </div>

        <div className="container py-12">
          {isLoading ? (
            <div className="grid sm:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {sizes?.map((size, idx) => {
                const isPopular = idx === 1;
                return (
                  <button
                    key={size.id}
                    onClick={() => navigate(`/montar/${categorySlug}/sabores?size=${size.id}`)}
                    className={`relative group rounded-2xl border-2 p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary ${
                      isPopular
                        ? "border-primary bg-accent shadow-red"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-gold text-secondary-foreground text-xs font-bold px-4 py-1 rounded-full">
                        Mais vendido
                      </span>
                    )}
                    <div className="font-display text-5xl font-black text-foreground mb-2">
                      {size.ml}<span className="text-lg text-muted-foreground font-normal">ml</span>
                    </div>
                    <div className="text-muted-foreground text-sm mb-4">{size.label}</div>
                    <div className="font-display text-3xl font-bold text-primary">
                      R$ {size.price.toFixed(2).replace(".", ",")}
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">por unidade</p>
                    <div className="mt-6 inline-flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Check className="h-4 w-4" /> Selecionar
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
