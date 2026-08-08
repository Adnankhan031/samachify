import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ImageSourcePropType } from 'react-native';

import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '@/lib/config';

export interface CartItem {
  productId: string;
  name: string;
  /** INR per unit, for display. The server re-prices before charging anything. */
  price: number;
  quantity: number;
  image: ImageSourcePropType;
}

/**
 * Storage key is app-scoped. The website keeps its own cart in localStorage under
 * `samachify_cart`; there is no server-side cart, so the two do not sync. Using a
 * distinct key makes that separation explicit rather than accidental.
 */
const STORAGE_KEY = 'samachify_mobile_cart_v1';

/** Guards against a corrupt quantity turning into a huge order. */
const MAX_QTY_PER_ITEM = 50;

interface CartValue {
  items: CartItem[];
  /** False until the persisted cart has been read — screens skip their empty state. */
  hydrated: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  quantityOf: (productId: string) => number;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  /** Rupees still needed to earn free delivery, or 0 once it's earned. */
  amountToFreeDelivery: number;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) return;
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as CartItem[]);
      })
      .catch(() => {
        // A corrupt cart is not worth blocking the app for — start empty.
      })
      .finally(() => {
        if (cancelled) return;
        hydratedRef.current = true;
        setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on change, but never before hydration — that would write the empty
  // initial state over a real saved cart.
  useEffect(() => {
    if (!hydratedRef.current) return;
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch(() => {});
  }, [items]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (!existing) return [...prev, { ...item, quantity }];
      return prev.map((i) =>
        i.productId === item.productId
          ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QTY_PER_ITEM) }
          : i
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(quantity, MAX_QTY_PER_ITEM) }
              : i
          )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // Mirrors the storefront's `priceCart`. Display only — the server decides.
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;

    return {
      items,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      quantityOf: (productId) => items.find((i) => i.productId === productId)?.quantity ?? 0,
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      amountToFreeDelivery: Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal),
    };
  }, [items, hydrated, addItem, removeItem, updateQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
