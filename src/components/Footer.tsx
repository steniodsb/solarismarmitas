import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logoSolaris from "@/assets/logo-solaris.webp";

const footerLinks = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export default function Footer() {
  return (
    <footer className="gradient-hero py-12">
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-4">
            <img src={logoSolaris} alt="Solaris Restaurante" className="h-12" />
            <p className="text-primary-foreground/60 text-sm max-w-sm">
              Marmitas congeladas saudáveis e deliciosas para sua rotina.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-primary-foreground">NAVEGAÇÃO</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link key={link.href} to={link.href} className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="space-y-4 sm:text-right">
            <h4 className="font-display text-lg font-bold text-primary-foreground">REDES SOCIAIS</h4>
            <div className="flex gap-3 sm:justify-end">
              <a href="https://api.whatsapp.com/send?phone=5551989173813&text=Ol%C3%A1!%20Gostaria%20de%20fazer%20um%20pedido." target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-secondary transition-colors" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-secondary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center">
          <p className="text-primary-foreground/40 text-xs">
            © 2026 Solaris Restaurante. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
