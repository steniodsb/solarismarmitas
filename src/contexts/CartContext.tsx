import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { CartItem, Product, ProductSize, ProductFlavor } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  isUpsellOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; size?: ProductSize; flavor?: ProductFlavor }
  | { type: "REMOVE_ITEM"; cartKey: string }
  | { type: "UPDATE_QUANTITY"; cartKey: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; open: boolean }
  | { type: "SET_CHECKOUT_OPEN"; open: boolean }
  | { type: "SET_UPSELL_OPEN"; open: boolean };

function getCartKey(productId: string, sizeId?: string, flavorId?: string) {
  return `${productId}__${sizeId || "default"}__${flavorId || "default"}`;
}

function getItemKey(item: CartItem) {
  return getCartKey(item.product.id, item.selectedSize?.id, item.selectedFlavor?.id);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = getCartKey(action.product.id, action.size?.id, action.flavor?.id);
      const existing = state.items.find((i) => getItemKey(i) === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            getItemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { product: action.product, quantity: 1, selectedSize: action.size, selectedFlavor: action.flavor },
        ],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => getItemKey(i) !== action.cartKey) };
    case "UPDATE_QUANTITY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => getItemKey(i) !== action.cartKey) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          getItemKey(i) === action.cartKey ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "SET_CART_OPEN":
      return { ...state, isOpen: action.open };
    case "SET_CHECKOUT_OPEN":
      return { ...state, isCheckoutOpen: action.open };
    case "SET_UPSELL_OPEN":
      return { ...state, isUpsellOpen: action.open };
    default:
      return state;
  }
}

function getItemPrice(item: CartItem) {
  return item.product.price + (item.selectedSize?.priceModifier || 0);
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  isUpsellOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (product: Product, size?: ProductSize, flavor?: ProductFlavor) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
  setUpsellOpen: (open: boolean) => void;
  getItemKey: (item: CartItem) => string;
  getItemPrice: (item: CartItem) => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isCheckoutOpen: false,
    isUpsellOpen: false,
  });

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce((acc, i) => acc + getItemPrice(i) * i.quantity, 0);

  const addItem = useCallback((product: Product, size?: ProductSize, flavor?: ProductFlavor) => dispatch({ type: "ADD_ITEM", product, size, flavor }), []);
  const removeItem = useCallback((cartKey: string) => dispatch({ type: "REMOVE_ITEM", cartKey }), []);
  const updateQuantity = useCallback((cartKey: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", cartKey, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const setCartOpen = useCallback((open: boolean) => dispatch({ type: "SET_CART_OPEN", open }), []);
  const setCheckoutOpen = useCallback((open: boolean) => dispatch({ type: "SET_CHECKOUT_OPEN", open }), []);
  const setUpsellOpen = useCallback((open: boolean) => dispatch({ type: "SET_UPSELL_OPEN", open }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        isCheckoutOpen: state.isCheckoutOpen,
        isUpsellOpen: state.isUpsellOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        setCartOpen,
        setCheckoutOpen,
        setUpsellOpen,
        getItemKey,
        getItemPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export { getItemKey, getItemPrice };
