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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold font-display mb-2">Create <span className="italic font-normal">Account</span></h1>
        <p className="text-gray-500 text-sm mb-8">Join us to track orders and save details</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors"
              placeholder="Your name"
            />
          </div>

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
              minLength={8}
              className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-[#1a1a1a] font-bold underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
