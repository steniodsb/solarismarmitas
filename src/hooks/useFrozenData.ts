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

export function useAllFrozenSizes() {
  return useQuery({
    queryKey: ["frozen-sizes-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frozen_sizes")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as FrozenSize[];
    },
  });
}

export function useAllFrozenFlavors() {
  return useQuery({
    queryKey: ["frozen-flavors-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frozen_flavors")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as FrozenFlavor[];
    },
  });
}

export interface PromoGalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  is_main: boolean;
  sort_order: number;
  active: boolean;
}

export function usePromoGallery() {
  return useQuery({
    queryKey: ["promo-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promo_gallery")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as PromoGalleryImage[];
    },
  });
}

export function useFrozenFlavorBySlug(categorySlug: string | undefined, flavorId: string | undefined) {
  const { data: categories } = useFrozenCategories();
  const category = categories?.find((c) => c.slug === categorySlug);

  const { data: flavors, isLoading } = useFrozenFlavors(category?.id);
  const flavor = flavors?.find((f) => f.id === flavorId);

  const { data: sizes } = useFrozenSizes(category?.id);

  return { category, flavor, sizes, flavors, isLoading };
}
