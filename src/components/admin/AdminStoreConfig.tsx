import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStoreConfig } from "@/hooks/useStoreConfig";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

export default function AdminStoreConfig() {
  const { data: config, isLoading } = useStoreConfig();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [whatsapp, setWhatsapp] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [closedMsg, setClosedMsg] = useState("");
  const [hours, setHours] = useState<{ day: string; open: string; close: string }[]>(
    DAYS.map((d) => ({ day: d, open: "", close: "" }))
  );

  useEffect(() => {
    if (!config) return;
    setWhatsapp(config.whatsappNumber);
    setMinOrder(String(config.minOrderValue));
    setClosedMsg(config.closedMessage);
    if (config.openingHours.length > 0) {
      setHours(DAYS.map((d) => {
        const found = config.openingHours.find((h: any) => h.day === d);
        return found || { day: d, open: "", close: "" };
      }));
    }
  }, [config]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    const { error } = await supabase
      .from("store_config")
      .update({
        whatsapp_number: whatsapp.trim(),
        min_order_value: parseFloat(minOrder) || 0,
        closed_message: closedMsg.trim(),
        opening_hours: hours,
      })
      .eq("id", config.id);
    if (error) {
      toast.error("Erro ao salvar configurações");
    } else {
      queryClient.invalidateQueries({ queryKey: ["store-config"] });
      toast.success("Configurações salvas!");
    }
    setSaving(false);
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Configurações da Loja</h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">WhatsApp (com DDD)</label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="5511999999999" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Valor mínimo do pedido (R$)</label>
            <Input type="number" step="0.01" min="0" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Mensagem de loja fechada</label>
          <Textarea value={closedMsg} onChange={(e) => setClosedMsg(e.target.value)} rows={2} />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Horários de Funcionamento</label>
          {hours.map((h, i) => (
            <div key={h.day} className="flex items-center gap-3">
              <span className="text-sm w-24 text-muted-foreground">{h.day}</span>
              <Input
                type="time"
                value={h.open}
                onChange={(e) => { const arr = [...hours]; arr[i] = { ...h, open: e.target.value }; setHours(arr); }}
                className="w-32"
                placeholder="Abertura"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="time"
                value={h.close}
                onChange={(e) => { const arr = [...hours]; arr[i] = { ...h, close: e.target.value }; setHours(arr); }}
                className="w-32"
                placeholder="Fechamento"
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Deixe em branco para marcar o dia como fechado.</p>
        </div>

        <Button variant="cta" size="lg" type="submit" disabled={saving} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Configurações
        </Button>
      </form>
    </div>
  );
}
