import { query } from '@/lib/db';

export default async function AdminDashboard() {
  const revenueResult = await query(`SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status != 'cancelled'`);
  const ordersResult = await query(`SELECT COUNT(*) AS count FROM orders`);
  const productsResult = await query(`SELECT COUNT(*) AS count FROM products`);
  const lowStockResult = await query(`
    SELECT p.name, pv.size, pv.color, pv.stock
    FROM product_variants pv
    JOIN products p ON pv.product_id = p.id
    WHERE pv.stock <= 5
    ORDER BY pv.stock ASC
    LIMIT 10
  `);
  const recentOrders = await query(`
    SELECT order_number AS "orderNumber", email, status, total, created_at AS "createdAt"
    FROM orders
    ORDER BY created_at DESC
    LIMIT 10
  `);

  const totalRevenue = revenueResult[0]?.total ? parseFloat(revenueResult[0].total) : 0;
  const totalOrders = ordersResult[0]?.count ? parseInt(ordersResult[0].count) : 0;
  const totalProducts = productsResult[0]?.count ? parseInt(productsResult[0].count) : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-8">Dashboard</h2>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 border border-black/10">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold">PKR {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 border border-black/10">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Total Orders</p>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 border border-black/10">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Total Products</p>
          <p className="text-3xl font-bold">{totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white p-6 border border-black/10">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Low Stock Alerts</h3>
          {lowStockResult.length === 0 ? (
            <p className="text-sm text-gray-400">All products well stocked</p>
          ) : (
            <ul className="space-y-2">
              {lowStockResult.map((item: any) => (
                <li key={`${item.name}-${item.size}-${item.color}`} className="flex justify-between text-sm border-b border-black/5 pb-2">
                  <span>{item.name} ({item.size} / {item.color})</span>
                  <span className="font-bold text-red-600">{item.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 border border-black/10">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400">No orders yet</p>
          ) : (
            <ul className="space-y-2">
              {recentOrders.map((order: any) => (
                <li key={order.orderNumber} className="flex justify-between text-sm border-b border-black/5 pb-2">
                  <span>{order.orderNumber}</span>
                  <span className="uppercase text-[10px] tracking-widest">{order.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
