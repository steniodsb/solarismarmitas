import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FrozenCartProvider } from "@/contexts/FrozenCartContext";
import HomePage from "./pages/HomePage";
import TrackingScripts from "./components/TrackingScripts";
import { useAnalyticsTracking } from "@/hooks/useAnalytics";

const OrderCategoriesPage = lazy(() => import("./pages/OrderCategoriesPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const FlavorDetailPage = lazy(() => import("./pages/FlavorDetailPage"));
const SizeSelectionPage = lazy(() => import("./pages/SizeSelectionPage"));
const FlavorSelectionPage = lazy(() => import("./pages/FlavorSelectionPage"));
const PromotionalPage = lazy(() => import("./pages/PromotionalPage"));
const ComboLinePage = lazy(() => import("./pages/ComboLinePage"));
const AreaAtendimentoPage = lazy(() => import("./pages/AreaAtendimentoPage"));
const SobrePage = lazy(() => import("./pages/SobrePage"));
const ContatoPage = lazy(() => import("./pages/ContatoPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AnalyticsTracker() {
  useAnalyticsTracking();
  return null;
}

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FrozenCartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TrackingScripts />
          <AnalyticsTracker />
          <Suspense fallback={<RouteFallback />}>
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
          </Suspense>
        </BrowserRouter>
      </FrozenCartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
