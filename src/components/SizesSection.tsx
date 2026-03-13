import size400 from "@/assets/size-400ml.jpg";
import size500 from "@/assets/size-500ml.jpg";
import size850 from "@/assets/size-850ml.jpg";

const sizes = [
  { label: "400ml", price: "R$ 16,90", desc: "Refeição individual leve", img: size400 },
  { label: "500ml", price: "R$ 19,90", desc: "Porção completa", highlight: true, img: size500 },
  { label: "850ml", price: "R$ 26,90", desc: "Porção grande / família", img: size850 },
];

export default function SizesSection() {
  return (
    <section className="py-12 sm:py-16 bg-card">
      <div className="container px-4">
        <div className="text-center mb-8 space-y-1">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Tamanhos disponíveis</h2>
          <p className="text-muted-foreground text-sm">Escolha a porção ideal para você</p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
          {sizes.map((s) => (
            <div
              key={s.label}
              className="relative rounded-2xl overflow-hidden border-2 border-border transition-all"
            >
              <div className="aspect-square">
                <img src={s.img} alt={`Marmita ${s.label}`} className="w-full h-full object-cover" />
              </div>
              <div className="px-3 py-2.5 text-center bg-background">
                <div className="font-display text-lg sm:text-xl font-black text-foreground leading-none">{s.label}</div>
                <div className="text-primary font-bold text-sm sm:text-base mt-0.5">{s.price}</div>
                <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5 leading-tight">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
