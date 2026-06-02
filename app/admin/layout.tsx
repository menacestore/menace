import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold font-display uppercase tracking-widest">Admin Panel</h1>
        <a href="/" className="text-[11px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
          View Store →
        </a>
      </header>
      <div className="flex">
        <nav className="w-56 bg-white border-r border-black/10 min-h-[calc(100vh-57px)] p-4">
          <ul className="space-y-2">
            <li>
              <a href="/admin" className="block px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/products" className="block px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Products
              </a>
            </li>
            <li>
              <a href="/admin/orders" className="block px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Orders
              </a>
            </li>
            <li>
              <a href="/admin/colors" className="block px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Colors
              </a>
            </li>
            <li>
              <a href="/admin/settings" className="block px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Settings
              </a>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
