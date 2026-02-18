import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Juliana S.",
    text: "As marmitas são incríveis! Sabor de comida caseira com praticidade. Super recomendo a FitMeal!",
    rating: 5,
  },
  {
    name: "Carlos M.",
    text: "Peço toda semana o combo de 10 marmitas. Preço justo e qualidade excelente. Adorei a Low Carb!",
    rating: 5,
  },
  {
    name: "Ana Paula R.",
    text: "Finalmente achei marmitas fitness gostosas! A entrega é super rápida e tudo chega fresquinho.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 gradient-hero">
      <div className="container space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground">
            Depoimentos
          </h2>
          <p className="text-primary-foreground/70">O que dizem nossos clientes</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-primary-foreground/10 backdrop-blur rounded-2xl p-6 space-y-4 border border-primary-foreground/10"
            >
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-primary-foreground/90 text-sm leading-relaxed">"{t.text}"</p>
              <p className="font-semibold text-secondary text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
