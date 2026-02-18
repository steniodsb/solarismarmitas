import { ClipboardList, ShoppingBag, Clock, Utensils } from "lucide-react";

const steps = [
  { icon: ClipboardList, title: "Escolha suas marmitas", description: "Navegue pelo nosso cardápio e selecione seus favoritos" },
  { icon: ShoppingBag, title: "Prepare seu pedido", description: "Adicione ao carrinho e ajuste as quantidades" },
  { icon: Clock, title: "Aguarde a confirmação", description: "Envie pelo WhatsApp e aguarde nossa confirmação" },
  { icon: Utensils, title: "Desfrute sua refeição", description: "Receba na sua porta e aproveite cada mordida" },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-background">
      <div className="container text-center space-y-12">
        <div className="space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Como <span className="text-primary">Funciona</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Faça pedido de maneira rápida e fácil.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                  <step.icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-sm font-bold text-secondary-foreground shadow-gold">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
