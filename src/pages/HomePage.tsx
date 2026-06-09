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
import carinaPetersen from "@/assets/carina-petersen.webp";

import catFitness from "@/assets/cat-fitness.webp";
import catLowcarb from "@/assets/cat-lowcarb.webp";
import catCaseira from "@/assets/cat-caseira.webp";
import catVegetariana from "@/assets/cat-vegetariana.webp";
import catSucos from "@/assets/cat-sucos.webp";

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
                    src={cat.image_url || categoryImages[cat.slug] || catFitness}
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
              { name: "Mastercard", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" },
              { name: "Elo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Cartão_Elo_logo.svg/200px-Cartão_Elo_logo.svg.png" },
              { name: "Visa", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" },
              { name: "Hipercard", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Hipercard_logo.svg/200px-Hipercard_logo.svg.png" },
              { name: "Banrisul", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Banrisul_logo.svg/200px-Banrisul_logo.svg.png" },
              { name: "Sodexo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sodexo_logo.svg/200px-Sodexo_logo.svg.png" },
              { name: "BanriCard", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/5/5c/Banricard.png/200px-Banricard.png" },
              { name: "Alelo", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Alelo.svg/200px-Alelo.svg.png" },
              { name: "VR", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/VR_Benefícios_logo.svg/200px-VR_Benefícios_logo.svg.png" },
              { name: "Ben Visa Vale", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Ben_Visa_Vale.svg/200px-Ben_Visa_Vale.svg.png" },
              { name: "GreenCard", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/c/ca/Green_Card_logo.png/200px-Green_Card_logo.png" },
              { name: "Ticket", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Ticket_logo.svg/200px-Ticket_logo.svg.png" },
              { name: "Verde Card", logo: "https://upload.wikimedia.org/wikipedia/pt/thumb/7/7a/VerdeCard.png/200px-VerdeCard.png" },
            ].map((card) => (
              <div
                key={card.name}
                className="bg-white border border-border rounded-xl p-2 sm:p-3 flex items-center justify-center aspect-[3/2] shadow-sm"
              >
                <img
                  src={card.logo}
                  alt={card.name}
                  className="max-h-8 sm:max-h-10 w-auto object-contain"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.style.display = "none";
                    el.parentElement!.innerHTML = `<span class="font-bold text-xs text-muted-foreground">${card.name}</span>`;
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 sm:gap-10 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💵</span>
              <span className="font-display font-bold text-foreground text-lg sm:text-xl">Dinheiro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-7 w-7" viewBox="0 0 512 512" fill="none">
                <rect width="512" height="512" rx="80" fill="#32BCAD"/>
                <path d="M256 100c-86 0-156 70-156 156s70 156 156 156 156-70 156-156S342 100 256 100zm0 260c-57.4 0-104-46.6-104-104s46.6-104 104-104 104 46.6 104 104-46.6 104-104 104z" fill="white"/>
                <circle cx="256" cy="256" r="52" fill="white"/>
              </svg>
              <span className="font-display font-bold text-foreground text-lg sm:text-xl">PIX</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
