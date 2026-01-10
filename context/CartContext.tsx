"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// 1. Definimos cómo se ve un producto en el carrito
export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

// 2. Definimos qué funciones tendrá nuestro contexto
interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartCount: number;
}

// 3. Creamos el contexto vacío
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. El Proveedor
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Función para añadir productos
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // setIsOpen(true); <--- ¡LÍNEA ELIMINADA! Ya no se abre solo.
  };

  // Función para quitar productos
  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Cálculos automáticos
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        total,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 5. Hook personalizado
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
}