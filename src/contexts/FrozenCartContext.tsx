import React, { createContext, useContext, useReducer, useCallback } from "react";
import type { FrozenSize, FrozenFlavor, FrozenCategory } from "@/hooks/useFrozenData";

export interface FrozenCartItem {
  id: string; // unique key
  category: FrozenCategory;
  size: FrozenSize;
  flavor: FrozenFlavor;
  quantity: number;
  unitPrice: number;
}

interface FrozenCartState {
  items: FrozenCartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
}

type Action =
  | { type: "ADD_ITEM"; item: Omit<FrozenCartItem, "id"> }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "UPDATE_QTY"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; open: boolean }
  | { type: "SET_CHECKOUT_OPEN"; open: boolean };

function makeId(item: { category: FrozenCategory; size: FrozenSize; flavor: FrozenFlavor }) {
  return `${item.category.id}__${item.size.id}__${item.flavor.id}`;
}

function reducer(state: FrozenCartState, action: Action): FrozenCartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const id = makeId(action.item);
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + action.item.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, id }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "UPDATE_QTY":
      if (action.quantity <= 0)
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, quantity: action.quantity } : i)),
      };
    case "CLEAR":
      return { ...state, items: [] };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };
    case "SET_CART_OPEN":
      return { ...state, isOpen: action.open };
    case "SET_CHECKOUT_OPEN":
      return { ...state, isCheckoutOpen: action.open };
    default:
      return state;
  }
}

interface FrozenCartContextType {
  items: FrozenCartItem[];
  isOpen: boolean;
  isCheckoutOpen: boolean;
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<FrozenCartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
}

const Ctx = createContext<FrozenCartContextType | null>(null);

export function FrozenCartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false, isCheckoutOpen: false });

  const totalItems = state.items.reduce((a, i) => a + i.quantity, 0);
  const totalPrice = state.items.reduce((a, i) => a + i.unitPrice * i.quantity, 0);

  const addItem = useCallback((item: Omit<FrozenCartItem, "id">) => dispatch({ type: "ADD_ITEM", item }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE_ITEM", id }), []);
  const updateQuantity = useCallback((id: string, quantity: number) => dispatch({ type: "UPDATE_QTY", id, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);
  const setCartOpen = useCallback((open: boolean) => dispatch({ type: "SET_CART_OPEN", open }), []);
  const setCheckoutOpen = useCallback((open: boolean) => dispatch({ type: "SET_CHECKOUT_OPEN", open }), []);

  return (
    <Ctx.Provider
      value={{ items: state.items, isOpen: state.isOpen, isCheckoutOpen: state.isCheckoutOpen, totalItems, totalPrice, addItem, removeItem, updateQuantity, clearCart, toggleCart, setCartOpen, setCheckoutOpen }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useFrozenCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFrozenCart must be used within FrozenCartProvider");
  return ctx;
}
