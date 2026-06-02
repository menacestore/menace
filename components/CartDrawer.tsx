'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, cartTotal } = useCart();

  const router = useRouter();
  const normalizeSize = (s: string) => {
    const map: Record<string, string> = { small: 'S', medium: 'M', large: 'L', 'extra large': 'XL', 'extra-large': 'XL', extralarge: 'XL' };
    return map[s.toLowerCase()] || s;
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`fixed inset-y-0 right-0 w-full max-w-sm bg-[#fcfcfc] border-l border-black/10 shadow-none z-50 flex flex-col transform transition-transform duration-300 ease-in-out p-8 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8 relative">
          <h3 className="text-xl font-display">Your Bag</h3>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{items.length} Items</span>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:opacity-50 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-400 gap-4">
              <ShoppingBag className="w-8 h-8 stroke-1" />
              <p className="text-[11px] uppercase tracking-[0.15em] font-medium">Bags are empty</p>
              <button 
                onClick={() => { setIsCartOpen(false); router.push('/products'); }}
                className="mt-4 px-6 py-3 border border-black text-[#1a1a1a] uppercase text-[10px] tracking-widest font-bold hover:bg-black hover:text-white transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex space-x-4 border-b border-black/10 pb-6">
                <div className="relative w-16 h-20 bg-gray-200 shrink-0">
                  <Image 
                    src={item.product.images[0]?.url || ''} 
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-between py-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="text-[12px] font-bold uppercase leading-tight">{item.product.name}</div>
                      <div className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">
                        Size: {normalizeSize(item.size)} / Color: {item.color}
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="text-gray-300 hover:text-black transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold">PKR {(item.product.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pt-6 space-y-4">
            <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500">
              <span>Subtotal</span>
              <span>PKR {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-widest text-gray-500">
              <span>Shipping</span>
              <span className="italic normal-case tracking-normal">Calculated at next step</span>
            </div>
            <div className="pt-4 flex justify-between items-baseline border-t border-black">
              <span className="text-[12px] font-bold uppercase tracking-widest">Total</span>
              <span className="text-2xl font-display font-bold">PKR {cartTotal.toLocaleString()}</span>
            </div>
            
            <Link 
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-black text-white text-center transition-opacity hover:opacity-85 py-5 mt-4 text-[11px] uppercase tracking-[0.2em] font-bold"
            >
              Secure Checkout
            </Link>
            
            <div className="flex justify-center items-center space-x-2 pt-2 opacity-30">
              <div className="w-2 h-2 rounded-full bg-black"></div>
              <div className="text-[9px] uppercase tracking-widest">Encrypted Transaction</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
