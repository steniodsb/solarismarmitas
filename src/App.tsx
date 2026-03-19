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
import ComboLinePage from "./pages/ComboLinePage";
import AreaAtendimentoPage from "./pages/AreaAtendimentoPage";
import SobrePage from "./pages/SobrePage";
import ContatoPage from "./pages/ContatoPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import TrackingScripts from "./components/TrackingScripts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FrozenCartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TrackingScripts />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pedir" element={<OrderCategoriesPage />} />
            <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
            <Route path="/categoria/:categorySlug/sabor/:flavorId" element={<FlavorDetailPage />} />
            <Route path="/montar/promocionais" element={<PromotionalPage />} />
            <Route path="/montar/promocionais/:lineSlug" element={<ComboLinePage />} />
            <Route path="/montar/:categorySlug/tamanho" element={<SizeSelectionPage />} />
            <Route path="/montar/:categorySlug" element={<FlavorSelectionPage />} />
            <Route path="/area-atendimento" element={<AreaAtendimentoPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FrozenCartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
