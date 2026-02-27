import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CheckoutModal from "@/components/CheckoutModal";
import UpsellModal from "@/components/UpsellModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import StoreStatusBanner from "@/components/StoreStatusBanner";
import ProductCard from "@/components/ProductCard";
import type { ProductSize, ProductFlavor } from "@/types";
import { toast } from "sonner";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);
  const related = products.filter((p) => p.id !== id && p.active).slice(0, 3);

  const [selectedSize, setSelectedSize] = useState<ProductSize | undefined>(product?.sizes?.[0]);
  const [selectedFlavor, setSelectedFlavor] = useState<ProductFlavor | undefined>(product?.flavors?.[0]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h1 className="font-display text-2xl font-bold text-foreground">Produto não encontrado</h1>
            <Button variant="cta" asChild><Link to="/cardapio">Voltar ao Cardápio</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isSoldOut = !product.available;
  const currentPrice = product.price + (selectedSize?.priceModifier || 0);

  const handleAdd = () => {
    if (isSoldOut) return;
    for (let i = 0; i < quantity; i++) addItem(product, selectedSize, selectedFlavor);
    toast.success(`${quantity}x ${product.name} adicionada(s) ao carrinho!`);
    setQuantity(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreStatusBanner />
      <Header />
      <main className="pt-16">
        <div className="bg-solaris-warm-gray border-b border-border">
          <div className="container py-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Início</Link>
            <span>/</span>
            <Link to="/cardapio" className="hover:text-primary transition-colors">Cardápio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
        </div>

        <section className="py-12 bg-background">
          <div className="container">
            <Link to="/cardapio" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> Voltar ao cardápio
            </Link>

            <div className="grid md:grid-cols-2 gap-10 items-start">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
                {isSoldOut && (
                  <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground font-bold text-lg px-6 py-3 rounded-full">Esgotado Hoje</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full mb-3">{product.category}</span>
                  <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">{product.name}</h1>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Ingredientes</h3>
                  <ul className="space-y-2">
                    {product.ingredients.map((ing) => (
                      <li key={ing} className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />{ing}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Size selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Tamanho</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size.id}
                          onClick={() => setSelectedSize(size)}
                          disabled={isSoldOut}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            selectedSize?.id === size.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-muted-foreground border-border hover:border-primary/50"
                          }`}
                        >
                          {size.label} {size.priceModifier > 0 && `(+R$ ${size.priceModifier.toFixed(2).replace(".", ",")})`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flavor selector */}
                {product.flavors && product.flavors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Sabor</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.flavors.map((flavor) => (
                        <button
                          key={flavor.id}
                          onClick={() => setSelectedFlavor(flavor)}
                          disabled={isSoldOut}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
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

                <div className="pt-4 border-t border-border">
                  <p className="font-display text-4xl font-black text-primary">R$ {currentPrice.toFixed(2).replace(".", ",")}</p>
                  <p className="text-sm text-muted-foreground mt-1">por marmita</p>
                </div>

                {!isSoldOut ? (
                  <>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors" aria-label="Diminuir">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors" aria-label="Aumentar">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <Button variant="cta" size="xl" onClick={handleAdd} className="flex-1 sm:flex-none">
                        <ShoppingCart className="h-5 w-5" /> Adicionar ao Carrinho
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Subtotal: <span className="font-bold text-foreground">R$ {(currentPrice * quantity).toFixed(2).replace(".", ",")}</span>
                    </p>
                  </>
                ) : (
                  <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-center font-semibold">
                    Este produto está esgotado hoje. Volte amanhã!
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="py-16 bg-solaris-warm-gray">
            <div className="container space-y-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Outras <span className="text-primary">Marmitas</span></h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <CartSidebar />
      <UpsellModal />
      <CheckoutModal />
      <WhatsAppButton />
    </div>
  );
}
