'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/data';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
  itemCount: number;
  isMounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleMount = () => {
      setIsMounted(true);
      const savedCart = localStorage.getItem('menace-cart');
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart');
        }
      }
    };
    handleMount();
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('menace-cart', JSON.stringify(items));
    }
  }, [items, isMounted]);

  const addItem = (product: Product, size: string, color: string, quantity: number) => {
    setItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
        const newItems = [...prev];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      }

      return [...prev, { product, size, color, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size && item.color === color))
    );
  };

  const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    
    setItems((prev) => {
      const newItems = [...prev];
      const index = newItems.findIndex(
        (item) => item.product.id === productId && item.size === size && item.color === color
      );
      if (index >= 0) {
        newItems[index].quantity = quantity;
      }
      return newItems;
    });
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        itemCount,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
