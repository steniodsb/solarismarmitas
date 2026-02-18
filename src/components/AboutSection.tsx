import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSolaris from "@/assets/logo-solaris.webp";

const differentials = [
  "Ingredientes frescos e selecionados",
  "Cardápio variado e nutritivo",
  "Embalagens seguras e práticas",
  "Entrega rápida na sua região",
];

export default function AboutSection() {
  return (
    <section id="quem-somos" className="py-20 bg-solaris-cream">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Quem Somos
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A Solaris nasceu da paixão por alimentação saudável e prática. Preparamos cada marmita com ingredientes 
              frescos e muito carinho, garantindo sabor e qualidade em cada refeição. Nossa missão é facilitar 
              sua rotina com opções nutritivas que cabem no seu bolso.
            </p>
            <ul className="space-y-3">
              {differentials.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="cta"
                size="lg"
                onClick={() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })}
              >
                Fazer Pedido
              </Button>
              <Button
                variant="ctaOutline"
                size="lg"
                onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
              >
                Fale Conosco
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-2xl gradient-hero flex items-center justify-center shadow-red">
              <img src={logoSolaris} alt="Solaris Restaurante" className="w-48 sm:w-56" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
