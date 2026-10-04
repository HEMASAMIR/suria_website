"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  stock: number;
  color?: string;
  size?: string;
};

type Ctx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (l: Omit<CartLine, "key">, silent?: boolean) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "zona-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback<Ctx["add"]>((l, silent) => {
    const key = `${l.productId}|${l.color ?? ""}|${l.size ?? ""}`;
    setLines((prev) => {
      const found = prev.find((x) => x.key === key);
      if (found) return prev.map((x) => (x.key === key ? { ...x, qty: Math.min(x.stock, x.qty + l.qty) } : x));
      return [...prev, { ...l, key }];
    });
    if (!silent) {
      toast.success("اتضافت للسلة 🛍️", { description: l.name });
      setOpen(true);
    }
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => prev.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(x.stock, qty)) } : x)));
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((x) => x.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<Ctx>(
    () => ({
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + l.qty * l.price, 0),
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, open, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
