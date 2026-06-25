'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-ink text-zinc-100 flex items-center justify-center px-4 -mt-20 pt-20">
      <div className="w-full max-w-md">
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Your Account</span>
        <h1 className="text-5xl font-heading uppercase tracking-tight leading-none mb-2">
          Welcome <span className="italic font-display font-normal lowercase tracking-normal text-accent">Back</span>
        </h1>
        <p className="text-zinc-400 text-sm mb-10">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-ink py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent font-bold hover:text-white transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
