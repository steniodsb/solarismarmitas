import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Heart, Leaf, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import carinaPetersen from "@/assets/carina-petersen.jpg";

const values = [
  {
    icon: Heart,
    title: "Feito com Carinho",
    description: "Cada marmita é preparada como se fosse para a nossa própria família.",
  },
  {
    icon: Leaf,
    title: "Ingredientes Frescos",
    description: "Selecionamos os melhores ingredientes para garantir sabor e nutrição.",
  },
  {
    icon: ShieldCheck,
    title: "Higiene Rigorosa",
    description: "Seguimos padrões rigorosos de higienização em toda a produção.",
  },
  {
    icon: Clock,
    title: "Desde 2018",
    description: "Anos de experiência cuidando da alimentação dos nossos clientes.",
  },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />

      <main className="pt-16">
        {/* Hero */}
        <section className="gradient-hero py-16 sm:py-20">
          <div className="container text-center space-y-4">
            <h1 className="font-display text-3xl sm:text-5xl font-black text-primary-foreground">
              Nossa História
            </h1>
            <p className="text-primary-foreground/70 max-w-lg mx-auto text-lg">
              Conheça quem está por trás de cada refeição que chega à sua mesa.
            </p>
          </div>
        </section>

        {/* About section with photo */}
        <section className="py-16 sm:py-20">
          <div className="container">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={carinaPetersen}
                  alt="Carina Petersen, proprietária do Restaurante Solaris"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">
                  <Heart className="h-4 w-4" /> Restaurante Solaris
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-snug">
                  Cada marmita é preparada como se fosse para a nossa própria família.
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Desde 2018, cuidamos de cada detalhe — da escolha dos ingredientes à higienização rigorosa e ao preparo com carinho.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A proprietária <strong className="text-foreground">Carina Petersen</strong> acompanha toda a produção, garantindo qualidade e atenção também na entrega, para que você se sinta verdadeiramente em casa.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">
              Nossos Valores
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="bg-card rounded-2xl p-6 text-center space-y-3 border border-border hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 sm:py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Nossa Missão
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Facilitar a rotina de quem busca uma alimentação equilibrada, oferecendo refeições congeladas que mantêm o sabor e os nutrientes de uma comida feita em casa.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Com diversas linhas — <strong className="text-foreground">Fitness</strong>, <strong className="text-foreground">Low Carb</strong>, <strong className="text-foreground">Caseira</strong> e <strong className="text-foreground">Vegetariana</strong> — temos opções para todos os gostos e objetivos.
              </p>
              <div className="pt-4">
                <Button variant="cta" size="xl" asChild>
                  <Link to="/pedir">
                    Conheça nossos produtos <ArrowRight className="h-5 w-5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
    </div>
  );
}
