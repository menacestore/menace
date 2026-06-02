'use client';

import { useState } from 'react';
import Link from 'next/link';

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
        <h1 className="text-4xl font-bold font-display mb-2">Order <span className="italic font-normal">Found</span></h1>
        <p className="text-gray-500 text-sm mb-8">Order #{order.orderNumber}</p>

        <div className="bg-[#fbfbfb] border border-black/10 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
              order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status}
            </span>
          </div>

          <div className="border-t border-black/10 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>PKR {parseFloat(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>PKR {parseFloat(order.shipping).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span>PKR {parseFloat(order.tax).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-black/10 pt-2">
              <span>Total</span>
              <span>PKR {parseFloat(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b border-black/10 pb-4">
              <div>
                <p className="font-bold text-sm uppercase">{item.product_name}</p>
                <p className="text-[10px] text-gray-400 uppercase">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block bg-[#1a1a1a] text-white px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold font-display mb-2">Track <span className="italic font-normal">Order</span></h1>
      <p className="text-gray-500 text-sm mb-8">Enter your order number and email to check status</p>

      <form onSubmit={handleTrack} className="space-y-6 max-w-md">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Order Number</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors"
            placeholder="ORD-XXXXXX"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a1a1a] text-white py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-[#1a1a1a] font-bold underline">
          Create one to manage orders
        </Link>
      </p>
    </div>
  );
}
