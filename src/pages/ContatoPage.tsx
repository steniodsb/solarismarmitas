import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";

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
        <section className="py-16">
          <div className="container max-w-md text-center space-y-4">
            <p className="text-muted-foreground">Fale conosco pelo WhatsApp ou redes sociais.</p>
            <a href="https://wa.me/5551989173813" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
              WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FrozenCartSidebar />
      <FrozenCheckoutModal />
      <WhatsAppButton />
    </div>
  );
}
