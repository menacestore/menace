import { query } from '@/lib/db';
import Link from 'next/link';

export default async function AdminOrders() {
  const orders = await query(`
    SELECT o.id, o.order_number AS "orderNumber", o.email, o.status, o.total, o.payment_method AS "paymentMethod", o.created_at AS "createdAt",
           (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
    FROM orders o
    ORDER BY o.created_at DESC
  `);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-8">Orders</h2>

      <div className="bg-white border border-black/10">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/10 text-[10px] uppercase tracking-widest text-gray-500">
              <th className="px-4 py-3 font-bold">Order #</th>
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Items</th>
              <th className="px-4 py-3 font-bold">Total</th>
              <th className="px-4 py-3 font-bold">Payment</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Date</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o.id} className="border-b border-black/5 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3 text-sm">{o.email}</td>
                <td className="px-4 py-3 text-sm">{o.item_count}</td>
                <td className="px-4 py-3 text-sm">PKR {parseFloat(o.total).toLocaleString()}</td>
                <td className="px-4 py-3 text-sm uppercase">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded ${statusColors[o.status] || 'bg-gray-100'}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="text-[10px] uppercase tracking-widest text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
