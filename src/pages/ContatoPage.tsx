import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";
import InfoSection from "@/components/InfoSection";

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="gradient-hero py-12">
          <div className="container text-center space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl font-black text-primary-foreground">
              Contato
            </h1>
            <p className="text-primary-foreground/70 max-w-md mx-auto">
              Entre em contato conosco. Estamos prontos para atender você!
            </p>
          </div>
        </section>
        <InfoSection />
      </main>
      <Footer />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />
      <WhatsAppButton />
    </div>
  );
}
