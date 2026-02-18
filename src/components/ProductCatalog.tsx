import { useState } from "react";
import { Search } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "./ProductCard";

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "Todos" || p.category === activeCategory;
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()));
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-red"
                    : "bg-card text-muted-foreground hover:bg-accent border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar marmita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-border bg-card pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Nenhuma marmita encontrada. Tente outra busca ou categoria.
          </p>
        )}
      </div>
    </section>
  );
}
