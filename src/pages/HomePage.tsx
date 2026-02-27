import { useNavigate } from "react-router-dom";
import { useFrozenCategories } from "@/hooks/useFrozenData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Snowflake, ArrowRight } from "lucide-react";
import logoSolaris from "@/assets/logo-solaris.webp";

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

const categoryEmojis: Record<string, string> = {
  fitness: "💪",
  "low-carb": "🥑",
  caseira: "🏠",
  vegetariana: "🥬",
  sucos: "🧃",
};

export default function HomePage() {
  const { data: categories, isLoading } = useFrozenCategories();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      {/* Hero */}
      <section className="pt-16">
        <div className="gradient-hero py-16 sm:py-24">
          <div className="container text-center space-y-5">
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
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Qual é o seu estilo?
            </h2>
            <p className="text-muted-foreground mt-2">Escolha a linha que combina com você</p>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    if (cat.slug === "sucos") {
                      navigate(`/montar/${cat.slug}/sabores`);
                    } else {
                      navigate(`/montar/${cat.slug}/tamanho`);
                    }
                  }}
                  className="group relative overflow-hidden rounded-2xl h-72 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img
                    src={categoryImages[cat.slug] || catFitness}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <span className="text-3xl mb-2">{categoryEmojis[cat.slug] || "🍱"}</span>
                    <h3 className="font-display text-2xl font-bold text-primary-foreground">{cat.name}</h3>
                    <p className="text-primary-foreground/70 text-sm mt-1 line-clamp-2">{cat.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 text-secondary font-semibold text-sm group-hover:gap-3 transition-all">
                      Escolher <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
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
