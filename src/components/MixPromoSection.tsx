import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePromoGallery } from "@/hooks/useFrozenData";
import catCaseira from "@/assets/cat-caseira.jpg";
import catVegetariana from "@/assets/cat-vegetariana.jpg";
import size400 from "@/assets/size-400ml.jpg";
import size500 from "@/assets/size-500ml.jpg";
import size850 from "@/assets/size-850ml.jpg";

const sizes = [
  { label: "400ml", price: "R$ 16,90", desc: "Refeição individual leve", img: size400 },
  { label: "500ml", price: "R$ 19,90", desc: "Porção completa", highlight: true, img: size500 },
  { label: "850ml", price: "R$ 26,90", desc: "Porção grande / família", img: size850 },
];

const lines = [
  {
    name: "Tradicional",
    img: catCaseira,
    items: [
      "Arroz branco",
      "Feijão",
      "Lentilha",
      "Purê / Massa",
      "Complementos",
      "Seletas",
      "Legumes",
      "Refogados",
      "Frangos variados",
      "Carnes variadas",
      "Filé de peixe",
    ],
  },
  {
    name: "Vegetariana",
    img: catVegetariana,
    items: [
      "Arroz branco ou integral",
      "Feijão",
      "Lentilha",
      "Purê / Massa",
      "Complementos",
      "Seletas",
      "Legumes",
      "Refogados",
      "Yakisoba",
      "Lasanha de brócolis",
      "Panquecas de legumes",
    ],
  },
];

export default function MixPromoSection() {
  const { data: gallery } = usePromoGallery();

  const mainImage = gallery?.find((img) => img.is_main) ?? gallery?.[0] ?? null;
  const thumbs = gallery?.filter((img) => img.id !== mainImage?.id).slice(0, 6) ?? [];

  const hasGallery = mainImage !== null && mainImage !== undefined;

  return (
    <section className="py-14 sm:py-20 bg-muted">
      <div className="container px-4">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold">
            <Flame className="h-4 w-4" />
            Mix Refeições Sortidas
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Combos Promocionais
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Montamos combos sortidos com combinações bem variadas pra você que não tem
            tempo de ficar escolhendo e quer praticidade nas suas refeições.
            Qualquer observação que não goste, preferências ou alergias — anote
            junto ao pedido para nossa cozinha cuidar.
          </p>
        </div>

        {/* Size cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl mx-auto mb-10">
          {sizes.map((s) => (
            <div
              key={s.label}
              className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                s.highlight ? "border-primary shadow-lg" : "border-border"
              }`}
            >
              {s.highlight && (
                <span className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap shadow">
                  Mais pedido
                </span>
              )}
              {/* Photo */}
              <div className="aspect-square">
                <img src={s.img} alt={`Marmita ${s.label}`} className="w-full h-full object-cover" />
              </div>
              {/* Info overlay at bottom */}
              <div className={`px-3 py-2.5 text-center ${s.highlight ? "bg-primary/5" : "bg-card"}`}>
                <div className="font-display text-lg sm:text-xl font-black text-foreground leading-none">
                  {s.label}
                </div>
                <div className="text-primary font-bold text-sm sm:text-base mt-0.5">{s.price}</div>
                <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5 leading-tight">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Photo gallery */}
        {hasGallery && (
          <div className="max-w-2xl mx-auto mb-10 space-y-2">
            {/* Main photo */}
            <div className="rounded-2xl overflow-hidden aspect-video sm:aspect-[16/7] bg-card border border-border">
              <img
                src={mainImage.image_url}
                alt={mainImage.alt_text ?? "Combo promocional Solaris"}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            {thumbs.length > 0 && (
              <div className="grid grid-cols-6 gap-2">
                {thumbs.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-xl overflow-hidden aspect-square bg-card border border-border"
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text ?? "Amostra do combo"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Line cards */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto mb-10">
          {lines.map((line) => (
            <div
              key={line.name}
              className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="h-40 sm:h-auto sm:w-40 shrink-0">
                <img
                  src={line.img}
                  alt={`Linha ${line.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-5 space-y-2">
                <h3 className="font-display font-bold text-foreground text-base">
                  Cardápio {line.name}
                </h3>
                <ul className="space-y-0.5">
                  {line.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="cta" size="lg" asChild>
            <Link to="/montar/promocionais">
              Pedir Combo Agora <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
