'use client';

import { useState } from 'react';
import Link from 'next/link';

const statusStyles: Record<string, string> = {
  pending:   'bg-yellow-900/40 text-yellow-400 border border-yellow-500/30',
  confirmed: 'bg-green-900/40 text-green-400 border border-green-500/30',
  shipped:   'bg-blue-900/40 text-blue-400 border border-blue-500/30',
  delivered: 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30',
  cancelled: 'bg-red-900/40 text-red-400 border border-red-500/30',
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || 'Order not found');
      setOrder(null);
    } else {
      setOrder(data.data);
    }
  };

  if (order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Your Order</span>
        <h1 className="text-5xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none mb-2">
          Order <span className="italic font-[family-name:var(--font-display)] font-normal lowercase tracking-normal text-accent">Found</span>
        </h1>
        <p className="text-zinc-400 text-sm mb-10">Order #{order.orderNumber}</p>

        <div className="bg-ink-soft border border-white/10 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${statusStyles[order.status] || 'bg-white/10 text-zinc-300'}`}>
              {order.status}
            </span>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Subtotal</span>
              <span>PKR {parseFloat(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Shipping</span>
              <span>PKR {parseFloat(order.shipping).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-white/10 pt-2">
              <span>Total</span>
              <span>PKR {parseFloat(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <p className="font-bold text-sm uppercase">{item.product_name}</p>
                <p className="text-[10px] text-zinc-500 uppercase">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block bg-accent text-ink px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Logistics</span>
      <h1 className="text-5xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none mb-2">
        Track <span className="italic font-[family-name:var(--font-display)] font-normal lowercase tracking-normal text-accent">Order</span>
      </h1>
      <p className="text-zinc-400 text-sm mb-10">Enter your order number and email to check status</p>

      <form onSubmit={handleTrack} className="space-y-6 max-w-md">
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors"
            placeholder="ORD-XXXXXX"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-ink py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      <p className="text-sm text-zinc-500 mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-accent font-bold hover:text-white transition-colors">
          Create one to manage orders
        </Link>
      </p>
    </div>
  );
}
