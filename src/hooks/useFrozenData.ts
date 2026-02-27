import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FrozenCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
}

export interface FrozenSize {
  id: string;
  category_id: string;
  label: string;
  ml: number;
  price: number;
  sort_order: number;
}

export interface FrozenFlavor {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string | null;
  sort_order: number;
}

export function useFrozenCategories() {
  return useQuery({
    queryKey: ["frozen-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frozen_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as FrozenCategory[];
    },
  });
}

export function useFrozenSizes(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["frozen-sizes", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frozen_sizes")
        .select("*")
        .eq("category_id", categoryId!)
        .order("sort_order");
      if (error) throw error;
      return data as FrozenSize[];
    },
    enabled: !!categoryId,
  });
}

export function useFrozenFlavors(categoryId: string | undefined) {
  return useQuery({
    queryKey: ["frozen-flavors", categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frozen_flavors")
        .select("*")
        .eq("category_id", categoryId!)
        .order("sort_order");
      if (error) throw error;
      return data as FrozenFlavor[];
    },
    enabled: !!categoryId,
  });
}
