import { Instagram, Facebook, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logoSolaris from "@/assets/logo-solaris.webp";
import { useStoreConfig } from "@/hooks/useStoreConfig";

const footerLinks = [
  { label: "Cardápio", href: "/cardapio" },
  { label: "Sobre", href: "/sobre" },
  { label: "Como Funciona", href: "/como-funciona" },
  { label: "Contato", href: "/contato" },
];

export default function Footer() {
  const { data: config } = useStoreConfig();

  const phone = config?.whatsappNumber
    ? `(${config.whatsappNumber.slice(2, 4)}) ${config.whatsappNumber.slice(4, 9)}-${config.whatsappNumber.slice(9)}`
    : "";

  return (
    <footer className="gradient-hero py-12">
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-4">
            <img src={logoSolaris} alt="Solaris Restaurante" className="h-12" />
            <p className="text-primary-foreground/60 text-sm max-w-sm">
              Marmitas saudáveis e deliciosas para sua rotina. Qualidade e sabor em cada refeição.
            </p>
            {config?.cnpj && (
              <p className="text-primary-foreground/40 text-xs">CNPJ: {config.cnpj}</p>
            )}
          </div>
          <div className="space-y-4">
            <h4 className="font-display text-lg font-bold text-primary-foreground">NAVEGAÇÃO</h4>
            <nav className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/70 hover:text-secondary text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="space-y-4 sm:text-right">
            <h4 className="font-display text-lg font-bold text-primary-foreground">FALE CONOSCO</h4>
            {phone && (
              <p className="text-primary-foreground/70 text-sm flex items-center gap-2 sm:justify-end">
                <Phone className="h-4 w-4" /> {phone}
              </p>
            )}
            {config?.address && (
              <p className="text-primary-foreground/70 text-sm flex items-center gap-2 sm:justify-end">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{config.address}<br />{config.city} - {config.state}<br />CEP: {config.zipCode}</span>
              </p>
            )}
            <div className="flex gap-3 sm:justify-end">
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
