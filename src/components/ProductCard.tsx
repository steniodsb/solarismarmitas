import { useState } from "react";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product, ProductSize, ProductFlavor } from "@/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(product.sizes?.[0]);
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | undefined>(product.flavors?.[0]);

  const currentPrice = product.price + (selectedSize?.priceModifier || 0);
  const isSoldOut = !product.available;

  const handleAdd = () => {
    if (isSoldOut) return;
    addItem(product, selectedSize, selectedFlavor);
    toast.success(`${product.name} adicionada ao carrinho!`, {
      description: `R$ ${currentPrice.toFixed(2).replace(".", ",")}${selectedSize ? ` • ${selectedSize.label}` : ""}${selectedFlavor ? ` • ${selectedFlavor.label}` : ""}`,
    });
  };

  return (
    <div className={`group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col ${isSoldOut ? "opacity-60 grayscale" : ""}`}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
          {product.category}
        </span>
        {isSoldOut && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground font-bold text-sm px-4 py-2 rounded-full">
              Esgotado Hoje
            </span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-card-foreground">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-3">{product.description}</p>

        <ul className="space-y-1 mb-3 flex-1">
          {product.ingredients.slice(0, 3).map((ing) => (
            <li key={ing} className="flex items-center gap-2 text-sm text-card-foreground">
              <CheckCircle className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
              {ing}
            </li>
          ))}
          {product.ingredients.length > 3 && (
            <li className="text-xs text-muted-foreground pl-5">+{product.ingredients.length - 3} mais</li>
          )}
        </ul>

        {/* Size selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Tamanho</p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  disabled={isSoldOut}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedSize?.id === size.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Flavor selector */}
        {product.flavors && product.flavors.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Sabor</p>
            <div className="flex flex-wrap gap-1.5">
              {product.flavors.map((flavor) => (
                <button
                  key={flavor.id}
                  onClick={() => setSelectedFlavor(flavor)}
                  disabled={isSoldOut}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    selectedFlavor?.id === flavor.id
                      ? "bg-secondary text-secondary-foreground border-secondary"
                      : "bg-card text-muted-foreground border-border hover:border-secondary/50"
                  }`}
                >
                  {flavor.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="font-display text-2xl font-black text-primary">
            R$ {currentPrice.toFixed(2).replace(".", ",")}
          </span>
          <div className="flex gap-2">
            <Button variant="ctaOutline" size="sm" asChild>
              <Link to={`/produto/${product.id}`}>Ver Mais</Link>
            </Button>
            <Button variant="cta" size="sm" onClick={handleAdd} disabled={isSoldOut}>
              <ShoppingCart className="h-4 w-4" />
              {isSoldOut ? "Esgotado" : "Pedir"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
