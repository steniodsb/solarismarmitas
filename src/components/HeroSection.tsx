import { Button } from "@/components/ui/button";
import heroMeals from "@/assets/hero-meals.jpg";

export default function HeroSection() {
  return (
    <section id="inicio" className="relative min-h-screen gradient-hero pt-16 flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/70 z-10" />
      <img
        src={heroMeals}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        loading="eager"
      />
      <div className="container relative z-20 py-20">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary">
            🔥 Marmitas Fitness & Tradicionais
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight">
            Chegue ao corpo dos seus sonhos com{" "}
            <span className="text-secondary">marmitas fitness</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-lg">
            Sou Nereu Júnior do Corpus Reis. Oferecemos refeições saudáveis, práticas e deliciosas para sua rotina.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              variant="cta"
              size="xl"
              onClick={() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })}
            >
              Pedir Agora
            </Button>
            <Button
              variant="heroOutline"
              size="xl"
              onClick={() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver Cardápio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
