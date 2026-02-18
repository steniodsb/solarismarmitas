export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: string[];
  image: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  notes: string;
}
