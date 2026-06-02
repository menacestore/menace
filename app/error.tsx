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
      <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Something went <span className="italic font-normal">wrong</span></h1>
      <p className="text-gray-500 mb-10 text-sm leading-relaxed max-w-sm mx-auto">An unexpected error occurred. Please try again or return to the homepage.</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={reset}
          className="bg-[#1a1a1a] text-white px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity"
        >
          Try Again
        </button>
        <Link 
          href="/"
          className="border border-black text-[#1a1a1a] px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-white transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
