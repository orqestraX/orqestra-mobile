import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  vendor: string;
  vendorLicense: string;
  price: number;
  unit: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  vendorGroups: () => Record<string, CartItem[]>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (item, qty) => set(state => {
    const existing = state.items.find(i => i.productId === item.productId);
    if (existing) {
      return { items: state.items.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + qty } : i) };
    }
    return { items: [...state.items, { ...item, quantity: qty }] };
  }),

  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

  updateQty: (id, qty) => set(state => ({
    items: qty <= 0
      ? state.items.filter(i => i.id !== id)
      : state.items.map(i => i.id === id ? { ...i, quantity: qty } : i)
  })),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  vendorGroups: () => get().items.reduce((groups, item) => {
    if (!groups[item.vendor]) groups[item.vendor] = [];
    groups[item.vendor].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>),
}));
