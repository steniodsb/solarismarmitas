import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CheckoutModal from "@/components/CheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import HowItWorks from "@/components/HowItWorks";
import PracticalSection from "@/components/PracticalSection";

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="gradient-hero py-12">
          <div className="container text-center space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground">
              Como Funciona
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Veja como é fácil pedir suas marmitas pela Solaris.
            </p>
          </div>
        </section>
        <PracticalSection />
        <HowItWorks />
      </main>
      <Footer />
      <CartSidebar />
      <CheckoutModal />
      <WhatsAppButton />
    </div>
  );
}
