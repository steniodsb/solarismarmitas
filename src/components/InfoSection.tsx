import { MapPin, Phone, Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const cities = [
  "Centro", "Zona Norte", "Zona Sul", "Zona Leste", "Zona Oeste",
  "Vila Nova", "Jardim América", "São José", "Santa Cruz",
];

const paymentMethods = ["Pix", "Cartão de Crédito", "Cartão de Débito", "VR", "Sodexo", "Alelo", "Dinheiro"];

export default function InfoSection() {
  return (
    <section id="contato" className="py-20 bg-solaris-cream">
      <div className="container space-y-16">
        {/* Cities + Contact */}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Atendemos às cidades
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {cities.map((city) => (
                <span key={city} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {city}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-foreground">Fale Conosco</h3>
            <div className="space-y-3">
              <p className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                (11) 99999-9999
              </p>
              <p className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-5 w-5 text-primary" />
                contato@solaris.com.br
              </p>
              <p className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                Rua Exemplo, 123 - Centro
              </p>
            </div>
            <Button
              variant="cta"
              size="lg"
              onClick={() => window.open("https://api.whatsapp.com/send?phone=5511999999999&text=Ol%C3%A1!%20Gostaria%20de%20mais%20informa%C3%A7%C3%B5es.", "_blank")}
            >
              Fale Conosco
            </Button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="text-center space-y-6">
          <h3 className="font-display text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Formas de Pagamento
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
