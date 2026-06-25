'use client';

import { useState } from 'react';
import { Mail, Instagram, Clock, Send, MessageSquare } from 'lucide-react';
import { contactInfo } from '@/lib/shopping-guide-details';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to send message');
        return;
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors";

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-8 lg:px-16 py-16 border-b border-white/10">
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Get in Touch</span>
        <h1 className="text-5xl sm:text-7xl font-heading uppercase tracking-tight leading-none">
          Contact <span className="italic font-display font-normal lowercase tracking-normal text-accent">Us</span>
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info + quick contact */}
          <div>
            <p className="text-[13px] text-zinc-400 leading-relaxed mb-10 max-w-md">
              Have a question about your order, sizing, or anything else? We&apos;re here to help. Fill out the form and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-start gap-4 border border-white/10 p-5 hover:border-accent transition-colors group bg-ink-soft"
              >
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-zinc-500 group-hover:text-accent transition-colors" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-100">Email Us</p>
                  <p className="text-[12px] text-zinc-400">{contactInfo.email}</p>
                </div>
              </a>

              <a
                href="https://instagram.com/menace.pk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 border border-white/10 p-5 hover:border-accent transition-colors group bg-ink-soft"
              >
                <Instagram className="w-4 h-4 mt-0.5 shrink-0 text-zinc-500 group-hover:text-accent transition-colors" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-100">Instagram</p>
                  <p className="text-[12px] text-zinc-400">{contactInfo.instagram}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 border border-white/10 p-5 bg-ink-soft">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-zinc-500" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-100">Support Hours</p>
                  <p className="text-[12px] text-zinc-400">{contactInfo.supportHours}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-100 mb-4">Frequently Asked</h3>
              <p className="text-[12px] text-zinc-400 leading-relaxed">
                Check our{' '}
                <a href="/shopping-guide" className="text-accent font-bold hover:text-white transition-colors">
                  Shopping Guide
                </a>{' '}
                for answers to common questions about orders, shipping, returns, and more.
              </p>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            {success ? (
              <div className="border border-green-500/30 bg-green-900/30 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-widest text-zinc-100 mb-2">Message Sent</h2>
                <p className="text-[13px] text-zinc-400 leading-relaxed max-w-sm mx-auto">
                  Thank you for reaching out. We&apos;ll review your message and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 bg-accent text-ink px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
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
                    className={inputCls}
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
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className={inputCls}
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={6}
                    className={inputCls + " resize-none"}
                    placeholder="Tell us more about your question or concern..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-ink py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
