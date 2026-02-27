import { Clock } from "lucide-react";
import { storeConfig } from "@/data/products";

function isStoreOpen(): boolean {
  const now = new Date();
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const todayName = days[now.getDay()];
  const todayConfig = storeConfig.openingHours.find((h) => h.day === todayName);

  if (!todayConfig || !todayConfig.open || !todayConfig.close) return false;

  const [openH, openM] = todayConfig.open.split(":").map(Number);
  const [closeH, closeM] = todayConfig.close.split(":").map(Number);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
}

export default function StoreStatusBanner() {
  const open = isStoreOpen();

  if (open) return null;

  return (
    <div className="bg-destructive text-destructive-foreground text-center py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2">
      <Clock className="h-4 w-4" />
      {storeConfig.closedMessage}
    </div>
  );
}
