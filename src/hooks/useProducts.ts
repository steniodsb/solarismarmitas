import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/types";

interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  sizes: any;
  flavors: any;
  ingredients: any;
  active: boolean;
  available: boolean;
  sort_order: number;
}

function mapDbProduct(row: DbProduct): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    image: row.image_url || "/placeholder.svg",
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    flavors: Array.isArray(row.flavors) ? row.flavors : [],
    ingredients: Array.isArray(row.ingredients) ? row.ingredients : [],
    active: row.active,
    available: row.available,
  };
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as DbProduct[]).map(mapDbProduct);
    },
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return mapDbProduct(data as DbProduct);
    },
    enabled: !!id,
  });
}

export function useCategories(products: Product[]) {
  const cats = Array.from(new Set(products.map((p) => p.category)));
  return ["Todos", ...cats];
}

export { mapDbProduct };
export type { DbProduct };
