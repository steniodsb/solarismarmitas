export interface ProductSize {
  id: string;
  label: string;
  priceModifier: number; // added to base price
}

export interface ProductFlavor {
  id: string;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  image: string;
  active: boolean;
  available: boolean; // in-stock today
  sizes?: ProductSize[];
  flavors?: ProductFlavor[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: ProductSize;
  selectedFlavor?: ProductFlavor;
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  notes: string;
  deliveryMode: "delivery" | "pickup";
}

export interface AddOnProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface StoreConfig {
  whatsappNumber: string;
  minOrderValue: number;
  openingHours: { day: string; open: string; close: string }[];
  closedMessage: string;
}
