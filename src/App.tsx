import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FrozenCartProvider } from "@/contexts/FrozenCartContext";
import HomePage from "./pages/HomePage";
import SizeSelectionPage from "./pages/SizeSelectionPage";
import FlavorSelectionPage from "./pages/FlavorSelectionPage";
import SobrePage from "./pages/SobrePage";
import ContatoPage from "./pages/ContatoPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
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
            <Route path="/montar/:categorySlug/tamanho" element={<SizeSelectionPage />} />
            <Route path="/montar/:categorySlug/sabores" element={<FlavorSelectionPage />} />
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
