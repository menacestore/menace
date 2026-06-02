import { query } from '@/lib/db';
import Link from 'next/link';

export default async function AdminProducts() {
  const products = await query(`
    SELECT p.id, p.name, p.category, p.price, p.featured, p.new_arrival AS "newArrival",
           (SELECT COUNT(*) FROM product_images pi WHERE pi.product_id = p.id) AS image_count,
           (SELECT COUNT(*) FROM product_variants pv WHERE pv.product_id = p.id) AS variant_count,
           (SELECT COALESCE(SUM(pv2.stock), 0) FROM product_variants pv2 WHERE pv2.product_id = p.id) AS total_stock
    FROM products p
    ORDER BY p.created_at DESC
  `);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-display">Products</h2>
        <Link href="/admin/products/new" className="bg-black text-white px-6 py-3 text-[11px] uppercase tracking-widest font-bold hover:opacity-85 transition-opacity">
          Add Product
        </Link>
      </div>

      <div className="bg-white border border-black/10">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black/10 text-[10px] uppercase tracking-widest text-gray-500">
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Category</th>
              <th className="px-4 py-3 font-bold">Price</th>
              <th className="px-4 py-3 font-bold">Stock</th>
              <th className="px-4 py-3 font-bold">Variants</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => (
              <tr key={p.id} className="border-b border-black/5 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-medium">{p.name}</td>
                <td className="px-4 py-3 text-sm capitalize">{p.category}</td>
                <td className="px-4 py-3 text-sm">PKR {parseFloat(p.price).toLocaleString()}</td>
                <td className={`px-4 py-3 text-sm font-bold ${p.total_stock === 0 ? 'text-red-600' : p.total_stock <= 10 ? 'text-orange-600' : ''}`}>{p.total_stock}</td>
                <td className="px-4 py-3 text-sm">{p.variant_count}</td>
                <td className="px-4 py-3 text-sm">
                  {p.featured && <span className="text-[9px] uppercase tracking-widest bg-black/5 px-2 py-1 mr-1">Featured</span>}
                  {p.newArrival && <span className="text-[9px] uppercase tracking-widest bg-black/5 px-2 py-1">New</span>}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Link href={`/admin/products/${p.id}`} className="text-[10px] uppercase tracking-widest text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
