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
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-ink-soft border-l border-white/10 z-50 flex flex-col p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-[family-name:var(--font-heading)] uppercase tracking-tight text-zinc-100">Your Bag</h3>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase text-zinc-600 tracking-widest">{items.length} Items</span>
            <button onClick={() => setIsCartOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-600 gap-4">
              <ShoppingBag className="w-8 h-8 stroke-1" />
              <p className="text-[11px] uppercase tracking-[0.15em] font-medium">Bag is empty</p>
              <button
                onClick={() => { setIsCartOpen(false); router.push('/products'); }}
                className="mt-4 px-6 py-3 border border-white/20 text-zinc-300 uppercase text-[10px] tracking-widest font-bold hover:border-accent hover:text-accent transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex space-x-4 border-b border-white/10 pb-6">
                <div className="relative w-16 h-20 bg-ink shrink-0 border border-white/10">
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
                      <div className="text-[12px] font-bold uppercase leading-tight text-zinc-100">{item.product.name}</div>
                      <div className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tighter">
                        Size: {normalizeSize(item.size)} / Color: {item.color}
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size, item.color)}
                      className="text-zinc-600 hover:text-zinc-100 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="text-zinc-500 hover:text-zinc-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-bold w-4 text-center text-zinc-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="text-zinc-500 hover:text-zinc-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-zinc-200">PKR {(item.product.price * item.quantity).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="pt-6 space-y-4">
            <div className="flex justify-between text-[11px] uppercase tracking-widest text-zinc-500">
              <span>Subtotal</span>
              <span className="text-zinc-300">PKR {cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px] uppercase tracking-widest text-zinc-500">
              <span>Shipping</span>
              <span className="italic normal-case tracking-normal text-zinc-500">Calculated at next step</span>
            </div>
            <div className="pt-4 flex justify-between items-baseline border-t border-white/10">
              <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-100">Total</span>
              <span className="text-2xl font-[family-name:var(--font-heading)] font-bold text-zinc-100">PKR {cartTotal.toLocaleString()}</span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-accent text-ink text-center hover:bg-white transition-colors py-5 mt-4 text-[11px] uppercase tracking-[0.2em] font-bold"
            >
              Secure Checkout
            </Link>

            <div className="flex justify-center items-center space-x-2 pt-2 opacity-30">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <div className="text-[9px] uppercase tracking-widest text-zinc-400">Encrypted Transaction</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
