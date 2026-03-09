import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FrozenCartProvider } from "@/contexts/FrozenCartContext";
import HomePage from "./pages/HomePage";
import OrderCategoriesPage from "./pages/OrderCategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import FlavorDetailPage from "./pages/FlavorDetailPage";
import SizeSelectionPage from "./pages/SizeSelectionPage";
import FlavorSelectionPage from "./pages/FlavorSelectionPage";
import PromotionalPage from "./pages/PromotionalPage";
import AreaAtendimentoPage from "./pages/AreaAtendimentoPage";
import SobrePage from "./pages/SobrePage";
import ContatoPage from "./pages/ContatoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FrozenCartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pedir" element={<OrderCategoriesPage />} />
            <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
            <Route path="/categoria/:categorySlug/sabor/:flavorId" element={<FlavorDetailPage />} />
            <Route path="/montar/promocionais" element={<PromotionalPage />} />
            <Route path="/montar/:categorySlug/tamanho" element={<SizeSelectionPage />} />
            <Route path="/montar/:categorySlug" element={<FlavorSelectionPage />} />
            <Route path="/area-atendimento" element={<AreaAtendimentoPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FrozenCartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
