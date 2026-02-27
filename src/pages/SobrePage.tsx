import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CheckoutModal from "@/components/CheckoutModal";
import UpsellModal from "@/components/UpsellModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import StoreStatusBanner from "@/components/StoreStatusBanner";
import AboutSection from "@/components/AboutSection";
import Testimonials from "@/components/Testimonials";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <StoreStatusBanner />
      <Header />
      <main className="pt-16">
        <section className="gradient-hero py-12">
          <div className="container text-center space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground">
              Quem Somos
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Conheça a história por trás da Solaris e nossa paixão por alimentação saudável.
            </p>
          </div>
        </section>
        <AboutSection />
        <Testimonials />
      </main>
      <Footer />
      <CartSidebar />
      <UpsellModal />
      <CheckoutModal />
      <WhatsAppButton />
    </div>
  );
}
