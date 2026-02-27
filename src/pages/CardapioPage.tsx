import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CheckoutModal from "@/components/CheckoutModal";
import UpsellModal from "@/components/UpsellModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import StoreStatusBanner from "@/components/StoreStatusBanner";
import ProductCatalog from "@/components/ProductCatalog";
import PromoSection from "@/components/PromoSection";

export default function CardapioPage() {
  return (
    <div className="min-h-screen bg-background">
      <StoreStatusBanner />
      <Header />
      <main className="pt-16">
        <section className="gradient-hero py-12">
          <div className="container text-center space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground">
              Nosso Cardápio
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Escolha suas marmitas favoritas e monte seu pedido. Entrega rápida na sua região!
            </p>
          </div>
        </section>
        <ProductCatalog />
        <PromoSection />
      </main>
      <Footer />
      <CartSidebar />
      <UpsellModal />
      <CheckoutModal />
      <WhatsAppButton />
    </div>
  );
}
