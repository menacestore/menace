import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const orders = await query(`
    SELECT order_number AS "orderNumber", email, status, subtotal, tax, shipping, total, payment_method AS "paymentMethod", shipping_address AS "shippingAddress", created_at AS "createdAt"
    FROM orders WHERE id = $1
  `, [id]);

  if (orders.length === 0) {
    return notFound();
  }

  const order = orders[0];
  const shippingAddress = typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress;

  const items = await query(`
    SELECT oi.id, oi.size, oi.color, oi.quantity, oi.price, p.name AS product_name
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `, [id]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Order <span className="italic font-normal">Confirmed.</span></h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
          Your order <span className="font-bold text-[#1a1a1a]">#{order.orderNumber}</span> has been placed. Check your email for tracking details.
        </p>
      </div>

      <div className="bg-[#fbfbfb] border border-black/10 p-6 mb-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-black/10">
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

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Shipping To</h3>
            <p className="text-sm">{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
            <p className="text-sm text-gray-500">{shippingAddress?.address}</p>
            <p className="text-sm text-gray-500">{shippingAddress?.city}, {shippingAddress?.province}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Payment</h3>
            <p className="text-sm uppercase">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b border-black/5 pb-4">
              <div>
                <p className="text-sm font-bold uppercase">{item.product_name}</p>
                <p className="text-[10px] text-gray-400 uppercase">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t border-black/10 pt-4">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>PKR {parseFloat(order.subtotal).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>PKR {parseFloat(order.shipping).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>PKR {parseFloat(order.tax).toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-base border-t border-black/10 pt-2"><span>Total</span><span>PKR {parseFloat(order.total).toLocaleString()}</span></div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Link href="/products" className="bg-[#1a1a1a] text-white px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity inline-block">
          Continue Shopping
        </Link>
        <Link href="/order/track" className="border border-black text-[#1a1a1a] px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-white transition-colors inline-block">
          Track Order
        </Link>
      </div>
    </div>
  );
}
