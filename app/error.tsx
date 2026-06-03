'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-32 text-center">
      <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Error</span>
      <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none mb-6">
        Something went <span className="italic font-[family-name:var(--font-display)] font-normal lowercase tracking-normal text-accent">wrong</span>
      </h1>
      <p className="text-zinc-400 mb-10 text-sm leading-relaxed max-w-sm mx-auto">An unexpected error occurred. Please try again or return to the homepage.</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={reset}
          className="bg-accent text-ink px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-white/20 text-zinc-100 px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:border-accent hover:text-accent transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
