import { Clock, Leaf, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  { icon: Clock, text: "Economia de tempo no dia a dia" },
  { icon: Leaf, text: "Ingredientes naturais e frescos" },
  { icon: ShieldCheck, text: "Qualidade garantida" },
  { icon: Truck, text: "Entrega rápida e segura" },
];

export default function PracticalSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto rounded-2xl gradient-hero p-8 sm:p-12 text-center space-y-6 shadow-red">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground">
            Sua Rotina Acelerada Merece Uma Solução Prática
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto">
            Sabemos que você não tem tempo para cozinhar todos os dias. Nossas marmitas são preparadas 
            com cuidado para garantir praticidade sem abrir mão do sabor e da nutrição.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-primary-foreground/10 p-3">
                  <Icon className="h-6 w-6 text-secondary" />
                </div>
                <span className="text-sm text-primary-foreground/80 text-center">{text}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              variant="cta"
              size="lg"
              onClick={() => document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" })}
            >
              Pedir Agora
            </Button>
            <Button
              variant="heroOutline"
              size="lg"
              onClick={() => document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" })}
            >
              Fale Conosco
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
