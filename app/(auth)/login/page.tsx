'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
        router.push(callbackUrl);
      } else {
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        router.push(session?.user?.role === 'admin' ? '/admin' : '/');
      }
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold font-display mb-2">Welcome <span className="italic font-normal">Back</span></h1>
        <p className="text-gray-500 text-sm mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[#1a1a1a] font-bold underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
