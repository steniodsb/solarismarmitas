import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import logoSolaris from "@/assets/logo-solaris.webp";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Cardápio", href: "/cardapio" },
  { label: "Sobre", href: "/sobre" },
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Contato", href: "/contato" },
];

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-red">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoSolaris} alt="Solaris Restaurante" className="h-10" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "text-secondary"
                  : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleCart}
            className="relative p-2 text-primary-foreground hover:text-secondary transition-colors"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground animate-bounce-in">
                {totalItems}
              </span>
            )}
          </button>

          <Button
            variant="cta"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => navigate("/cardapio")}
          >
            Pedir Agora
          </Button>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-primary-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden gradient-hero border-t border-primary-foreground/10 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-6 py-3 transition-colors ${
                location.pathname === link.href
                  ? "text-secondary bg-primary-foreground/5"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/5"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
