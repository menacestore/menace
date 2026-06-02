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
    <div className="mb-16">
      <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">
        Search <span className="italic font-normal">Results</span>
      </h1>
      <form onSubmit={handleSubmit} className="flex gap-4 max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors"
        />
        <button
          type="submit"
          className="bg-[#1a1a1a] text-white px-6 py-4 font-bold uppercase tracking-[0.1em] text-[11px] hover:opacity-85 transition-opacity flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>
    </div>
  );
}
