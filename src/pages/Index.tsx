import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PracticalSection from "@/components/PracticalSection";
import ProductCatalog from "@/components/ProductCatalog";
import PromoSection from "@/components/PromoSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CheckoutModal from "@/components/CheckoutModal";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <PracticalSection />
        <ProductCatalog />
        <PromoSection />
        <HowItWorks />
        <Testimonials />
        <InfoSection />
      </main>
      <Footer />
      <CartSidebar />
      <CheckoutModal />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
