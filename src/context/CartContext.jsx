"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart_items")) || [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  function add(product, qty = 1) {
    setItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists)
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p
        );
      return [...prev, { ...product, qty }];
    });
  }

  function remove(productId) {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }

  function clear() {
    setItems([]);
  }

  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
