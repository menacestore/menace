'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data.data);
        setLoading(false);
      });
  }, [id]);

  const updateStatus = async (status: string) => {
    setUpdating(true);
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id, status }),
    });
    setUpdating(false);
    setOrder({ ...order, status });
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (!order) return <p className="p-8">Order not found</p>;

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-display">Order {order.orderNumber}</h2>
        <button onClick={() => router.back()} className="text-[11px] uppercase tracking-widest text-gray-500 hover:text-black">
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 border border-black/10 space-y-6">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Customer</h3>
            <p className="text-sm font-medium">{order.email}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.address}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.province}</p>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Payment</h3>
            <p className="text-sm uppercase">{order.paymentMethod}</p>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={updating || order.status === s}
                  className={`px-3 py-2 text-[10px] uppercase tracking-widest font-bold border transition-colors ${
                    order.status === s
                      ? 'bg-black text-white border-black'
                      : 'border-black/20 hover:bg-gray-100'
                  } disabled:opacity-50`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-black/10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Items</h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center border-b border-black/5 pb-4">
                <div>
                  <p className="text-sm font-bold uppercase">{item.product_name || 'Product'}</p>
                  <p className="text-[10px] text-gray-400 uppercase">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold">PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm border-t border-black/10 pt-4">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>PKR {parseFloat(order.subtotal).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>PKR {parseFloat(order.shipping).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>PKR {parseFloat(order.tax).toLocaleString()}</span></div>
            <div className="flex justify-between font-bold text-base border-t border-black/10 pt-2"><span>Total</span><span>PKR {parseFloat(order.total).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
