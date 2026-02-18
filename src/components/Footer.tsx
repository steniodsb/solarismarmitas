import { Instagram, Facebook } from "lucide-react";
import logoSolaris from "@/assets/logo-solaris.webp";

export default function Footer() {
  return (
    <footer className="gradient-hero py-12">
      <div className="container">
        <div className="grid sm:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <img src={logoSolaris} alt="Solaris Restaurante" className="h-12" />
            <p className="text-primary-foreground/60 text-sm max-w-sm">
              Marmitas saudáveis e deliciosas para sua rotina. Qualidade e sabor em cada refeição.
            </p>
          </div>
          <div className="space-y-4 sm:text-right">
            <h4 className="font-display text-lg font-bold text-primary-foreground">FALE CONOSCO</h4>
            <p className="text-primary-foreground/70 text-sm">(11) 99999-9999</p>
            <p className="text-primary-foreground/70 text-sm">contato@solaris.com.br</p>
            <p className="text-primary-foreground/70 text-sm">Rua Exemplo, 123 - Centro</p>
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
