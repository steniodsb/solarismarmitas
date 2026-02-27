import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FrozenCartSidebar from "@/components/frozen/FrozenCartSidebar";
import FrozenCheckoutModal from "@/components/frozen/FrozenCheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
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
        <section className="py-16">
          <div className="container max-w-2xl space-y-6 text-muted-foreground">
            <p>A Solaris nasceu da vontade de levar alimentação saudável, prática e acessível para o dia a dia. Nossas marmitas congeladas são preparadas com ingredientes frescos e selecionados.</p>
            <p>Cada refeição é pensada para equilibrar sabor e nutrição, atendendo diferentes estilos de vida — do fitness ao tradicional.</p>
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
