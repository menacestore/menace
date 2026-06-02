'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export default function SortDropdown({ defaultSort }: { defaultSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = useCallback((sort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', sort);
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <select 
      value={defaultSort}
      onChange={(e) => handleSort(e.target.value)}
      className="text-[10px] uppercase tracking-widest text-gray-400 border-none bg-transparent font-bold focus:ring-0 cursor-pointer outline-none hover:text-[#1a1a1a] transition-colors"
    >
      <option value="newest">Sort by: Newest</option>
      <option value="price-asc">Sort by: Price (Low to High)</option>
      <option value="price-desc">Sort by: Price (High to Low)</option>
    </select>
  );
}
