import { Link } from "react-router-dom";
import { useFrozenCategories } from "@/hooks/useFrozenData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import SizesSection from "@/components/SizesSection";
import { Snowflake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import carinaPetersen from "@/assets/carina-petersen.jpg";

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
  promocionais: catFitness,
};

const categoryEmojis: Record<string, string> = {
  fitness: "💪",
  "low-carb": "🥑",
  caseira: "🏠",
  vegetariana: "🥬",
  sucos: "🧃",
  promocionais: "🔥",
};

export default function HomePage() {
  const { data: categories, isLoading } = useFrozenCategories();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      {/* Hero — solid red gradient */}
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

      {/* Escolha sua linha — category grid */}
      <section className="py-12 sm:py-16">
        <div className="container px-4">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Escolha sua linha</h2>
            <p className="text-muted-foreground mt-1">Selecione a categoria para montar seu pedido</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 sm:h-64 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.slug === "promocionais" ? "/montar/promocionais" : `/montar/${cat.slug}`}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl h-48 sm:h-64 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary"
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <SizesSection />


      {/* Conheça nossa empresa — no clickable links */}
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

      {/* Formas de Pagamento */}
      <section className="py-12 sm:py-16 bg-card">
        <div className="container px-4">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-3">
            Formas de Pagamento
          </h2>
          <p className="text-muted-foreground text-center mb-8 text-sm sm:text-base">
            Cartões: Débito, Crédito, Refeição e Alimentação
          </p>
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {[
              { name: "MasterCard", bg: "bg-[#1A1F71]", text: "text-white" },
              { name: "Elo", bg: "bg-[#1D1D1B]", text: "text-white" },
              { name: "Visa", bg: "bg-white border border-border", text: "text-[#1A1F71]" },
              { name: "Hipercard", bg: "bg-white border border-border", text: "text-[#822124]" },
              { name: "Banrisul", bg: "bg-[#005BAA]", text: "text-white" },
              { name: "Sodexo", bg: "bg-white border border-border", text: "text-[#1D3160]" },
              { name: "BanriCard", bg: "bg-white border border-border", text: "text-[#005BAA]" },
              { name: "Alelo", bg: "bg-[#00A651]", text: "text-white" },
              { name: "VR", bg: "bg-[#009639]", text: "text-white" },
              { name: "Ben Visa Vale", bg: "bg-[#00A651]", text: "text-white" },
              { name: "GreenCard", bg: "bg-white border border-border", text: "text-[#00854A]" },
              { name: "Ticket", bg: "bg-white border border-border", text: "text-[#E30613]" },
              { name: "Verde Card", bg: "bg-[#00854A]", text: "text-white" },
            ].map((card) => (
              <div
                key={card.name}
                className={`${card.bg} ${card.text} rounded-xl p-3 flex items-center justify-center aspect-[3/2] shadow-sm`}
              >
                <span className="font-bold text-xs sm:text-sm text-center leading-tight">{card.name}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 sm:gap-10 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💵</span>
              <span className="font-display font-bold text-foreground text-lg sm:text-xl">Dinheiro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <span className="font-display font-bold text-foreground text-lg sm:text-xl">PIX</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
