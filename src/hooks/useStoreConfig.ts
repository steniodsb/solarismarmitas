import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StoreConfig } from "@/types";

interface DbStoreConfig {
  id: string;
  whatsapp_number: string;
  min_order_value: number;
  opening_hours: any;
  closed_message: string;
}

function mapDbConfig(row: DbStoreConfig): StoreConfig & { id: string } {
  return {
    id: row.id,
    whatsappNumber: row.whatsapp_number,
    minOrderValue: Number(row.min_order_value),
    openingHours: Array.isArray(row.opening_hours) ? row.opening_hours : [],
    closedMessage: row.closed_message,
  };
}

export function useStoreConfig() {
  return useQuery({
    queryKey: ["store-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_config")
        .select("*")
        .limit(1)
        .single();
      if (error) throw error;
      return mapDbConfig(data as DbStoreConfig);
    },
  });
}
