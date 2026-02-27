import { Clock, Loader2 } from "lucide-react";
import { useStoreConfig } from "@/hooks/useStoreConfig";

export default function StoreStatusBanner() {
  const { data: config, isLoading } = useStoreConfig();

  if (isLoading || !config) return null;

  const now = new Date();
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const todayName = days[now.getDay()];
  const todayConfig = config.openingHours.find((h: any) => h.day === todayName);

  let isOpen = false;
  if (todayConfig && todayConfig.open && todayConfig.close) {
    const [openH, openM] = todayConfig.open.split(":").map(Number);
    const [closeH, closeM] = todayConfig.close.split(":").map(Number);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    isOpen = nowMinutes >= openH * 60 + openM && nowMinutes < closeH * 60 + closeM;
  }

  if (isOpen) return null;

  return (
    <div className="bg-destructive text-destructive-foreground text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2">
      <Clock className="h-4 w-4" />
      {config.closedMessage}
    </div>
  );
}
