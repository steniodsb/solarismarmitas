import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import heroMeals from "@/assets/hero-meals.jpg";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import HowItWorks from "@/components/HowItWorks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CheckoutModal from "@/components/CheckoutModal";
import UpsellModal from "@/components/UpsellModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import StoreStatusBanner from "@/components/StoreStatusBanner";

const Index = () => {
  const { data: products, isLoading } = useProducts();
  const featured = (products || []).filter(p => p.active).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <StoreStatusBanner />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] gradient-hero pt-16 flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/70 z-10" />
          <img src={heroMeals} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" loading="eager" />
          <div className="container relative z-20 py-16">
            <div className="max-w-2xl space-y-6 animate-fade-in">
              <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-medium text-secondary">
                🔥 Marmitas Fitness & Tradicionais
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight">
                Chegue ao corpo dos seus sonhos com{" "}
                <span className="text-secondary">marmitas fitness</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-lg">
                Sou Nereu Júnior do Corpus Reis. Oferecemos refeições saudáveis, práticas e deliciosas para sua rotina.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button variant="cta" size="xl" asChild>
                  <Link to="/cardapio">Pedir Agora</Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/cardapio">Ver Cardápio</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="py-16 bg-solaris-warm-gray">
          <div className="container space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Destaques do <span className="text-primary">Cardápio</span>
              </h2>
              <Button variant="ctaOutline" size="sm" asChild>
                <Link to="/cardapio">Ver Tudo</Link>
              </Button>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        <HowItWorks />
      </main>
      <Footer />
      <CartSidebar />
      <UpsellModal />
      <CheckoutModal />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
