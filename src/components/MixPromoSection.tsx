import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { usePromoGallery } from "@/hooks/useFrozenData";
import catCaseira from "@/assets/cat-caseira.webp";
import catVegetariana from "@/assets/cat-vegetariana.webp";
import catFitness from "@/assets/cat-fitness.webp";
import catLowcarb from "@/assets/cat-lowcarb.webp";
import size400 from "@/assets/size-400ml.webp";
import size500 from "@/assets/size-500ml.webp";
import size850 from "@/assets/size-850ml.webp";

const sizes = [
  { label: "400ml", price: "R$ 16,90", desc: "Refeição individual leve", img: size400 },
  { label: "500ml", price: "R$ 19,90", desc: "Porção completa", highlight: true, img: size500 },
  { label: "850ml", price: "R$ 26,90", desc: "Porção grande / família", img: size850 },
];

const lines = [
  {
    name: "Tradicional",
    slug: "tradicional",
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
    slug: "vegetariana",
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
  {
    name: "Fitness",
    slug: "fitness",
    img: catFitness,
    items: [
      "Arroz integral",
      "Batata doce",
      "Quinoa",
      "Legumes grelhados",
      "Brócolis",
      "Espinafre",
      "Frango grelhado",
      "Carne magra",
      "Tilápia / Salmão",
      "Omelete proteico",
      "Grão de bico",
    ],
  },
  {
    name: "Lowcarb",
    slug: "low-carb",
    img: catLowcarb,
    items: [
      "Abobrinha",
      "Berinjela gratinada",
      "Couve-flor",
      "Aspargos",
      "Cogumelos",
      "Brócolis",
      "Frango grelhado",
      "Carne moída magra",
      "Salmão ao forno",
      "Lombo suíno",
      "Tomate assado",
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
            Montamos combos sortidos, bem variadas para você que não tem tempo de
            ficar escolhido e quer praticidade nas suas refeições. Qualquer
            observação que não goste, preferências ou alergias — anote junto ao
            pedido para nossa cozinha cuidar.
          </p>
        </div>

        {/* Photo gallery */}
        {hasGallery && (
          <div className="max-w-2xl mx-auto mb-10 space-y-2">
            {/* Main photo */}
            <div className="rounded-2xl overflow-hidden bg-card border border-border">
              <img
                src={mainImage.image_url}
                alt={mainImage.alt_text ?? "Combo promocional Solaris"}
                className="w-full h-auto object-contain"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-10">
          {lines.map((line) => (
            <Link
              key={line.name}
              to={`/montar/promocionais/${line.slug}`}
              className="rounded-2xl border border-border bg-card overflow-hidden flex flex-col hover:shadow-xl hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="h-40 shrink-0">
                <img
                  src={line.img}
                  alt={`Linha ${line.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 sm:p-4 space-y-2">
                <h3 className="font-display font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  Cardápio {line.name}
                </h3>
                <div className="pt-2">
                  <span className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground font-semibold text-sm py-2.5 group-hover:bg-primary/90 transition-colors">
                    Pedir combo <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
