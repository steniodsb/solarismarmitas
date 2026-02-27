import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

export default function ProductCatalog() {
  const { data: products, isLoading } = useProducts();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const categories = useCategories(products || []);

  const filtered = (products || []).filter((p) => {
    const matchCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ingredients.some((i: string) => i.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch && p.active;
  });

  return (
    <section id="cardapio" className="py-20 bg-solaris-warm-gray">
      <div className="container space-y-8">
        <div className="text-center space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
            Nossas <span className="text-primary">Marmitas</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Escolha entre nossas deliciosas opções preparadas com ingredientes frescos e selecionados.
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou ingrediente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="relative">
          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide justify-start sm:justify-center snap-x snap-mandatory px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 snap-start px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-red scale-[1.02]"
                    : "bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-border/60 hover:border-primary/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Nenhuma marmita encontrada. Tente outra busca ou categoria.
          </p>
        )}
      </div>
    </section>
  );
}
