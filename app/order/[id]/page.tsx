import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const statusStyles: Record<string, string> = {
  pending:   'bg-yellow-900/40 text-yellow-400 border border-yellow-500/30',
  confirmed: 'bg-green-900/40 text-green-400 border border-green-500/30',
  shipped:   'bg-blue-900/40 text-blue-400 border border-blue-500/30',
  delivered: 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/30',
  cancelled: 'bg-red-900/40 text-red-400 border border-red-500/30',
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const orders = await query(`
    SELECT order_number AS "orderNumber", email, status, subtotal, tax, shipping, total, payment_method AS "paymentMethod", shipping_address AS "shippingAddress", created_at AS "createdAt"
    FROM orders WHERE id = $1
  `, [id]);

  if (orders.length === 0) return notFound();

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
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Thank You</span>
        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none mb-6">
          Order <span className="italic font-[family-name:var(--font-display)] font-normal lowercase tracking-normal text-accent">Confirmed.</span>
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
          Your order <span className="font-bold text-zinc-100">#{order.orderNumber}</span> has been placed. Check your email for tracking details.
        </p>
      </div>

      <div className="bg-ink-soft border border-white/10 p-6 mb-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${statusStyles[order.status] || 'bg-white/10 text-zinc-300'}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Shipping To</h3>
            <p className="text-sm">{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
            <p className="text-sm text-zinc-400">{shippingAddress?.address}</p>
            <p className="text-sm text-zinc-400">{shippingAddress?.city}, {shippingAddress?.province}</p>
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Payment</h3>
            <p className="text-sm uppercase">{order.paymentMethod}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-bold uppercase">{item.product_name}</p>
                <p className="text-[10px] text-zinc-500 uppercase">Size: {item.size} / Color: {item.color} / Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">PKR {(parseFloat(item.price) * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t border-white/10 pt-4">
          <div className="flex justify-between"><span className="text-zinc-400">Subtotal</span><span>PKR {parseFloat(order.subtotal).toLocaleString()}</span></div>
          <div className="flex justify-between"><span className="text-zinc-400">Shipping</span><span>PKR {parseFloat(order.shipping).toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2"><span>Total</span><span>PKR {parseFloat(order.total).toLocaleString()}</span></div>
        </div>
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/products" className="bg-accent text-ink px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors inline-block">
          Continue Shopping
        </Link>
        <Link href="/order/track" className="border border-white/20 text-zinc-100 px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:border-accent hover:text-accent transition-colors inline-block">
          Track Order
        </Link>
      </div>
    </div>
  );
}
