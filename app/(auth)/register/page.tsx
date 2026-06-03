'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Registration failed');
    } else {
      router.push('/login?registered=true');
    }
  };

  return (
    <div className="min-h-screen bg-ink text-zinc-100 flex items-center justify-center px-4 -mt-20 pt-20">
      <div className="w-full max-w-md">
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Join Menace</span>
        <h1 className="text-5xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none mb-2">
          Create <span className="italic font-[family-name:var(--font-display)] font-normal lowercase tracking-normal text-accent">Account</span>
        </h1>
        <p className="text-zinc-400 text-sm mb-10">Join us to track orders and save details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors"
              placeholder="Your name"
            />
          </div>

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
              minLength={8}
              className="w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-ink py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-accent font-bold hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
