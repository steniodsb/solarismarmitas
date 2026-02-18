import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} adicionada ao carrinho!`, {
      description: `R$ ${product.price.toFixed(2).replace(".", ",")}`,
    });
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-border flex flex-col">
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
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl font-bold text-card-foreground">{product.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-3">{product.description}</p>
        <ul className="space-y-1.5 mb-4 flex-1">
          {product.ingredients.map((ing) => (
            <li key={ing} className="flex items-center gap-2 text-sm text-card-foreground">
              <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
              {ing}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="font-display text-2xl font-black text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          <div className="flex gap-2">
            <Button variant="ctaOutline" size="sm" asChild>
              <Link to={`/produto/${product.id}`}>Ver Mais</Link>
            </Button>
            <Button variant="cta" size="sm" onClick={handleAdd}>
              Pedir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
