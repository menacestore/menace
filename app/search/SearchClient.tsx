'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Search } from 'lucide-react';

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-8 max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-1 bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-500 p-4 text-sm focus:border-accent outline-none transition-colors"
      />
      <button
        type="submit"
        className="bg-accent text-ink px-6 py-4 font-bold uppercase tracking-[0.1em] text-[11px] hover:bg-white transition-colors flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        Search
      </button>
    </form>
  );
}
