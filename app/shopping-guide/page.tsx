'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, Mail, Instagram, Clock } from 'lucide-react';
import {
  shoppingFaqs,
  exchangeReturnPolicy,
  clothingCare,
  contactInfo,
} from '@/lib/shopping-guide-details';

export default function ShoppingGuidePage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const toggleFaq = (key: string) => setOpenFaq(prev => (prev === key ? null : key));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 sm:px-8 lg:px-16 py-16 border-b border-white/10">
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Help & Information</span>
        <h1 className="text-5xl sm:text-7xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none">
          Shopping <span className="italic font-[family-name:var(--font-display)] font-normal lowercase tracking-normal text-accent">Guide</span>
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-0 py-16 space-y-24">

        {/* FAQ */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-10">Frequently Asked Questions</h2>
          <div className="space-y-12">
            {shoppingFaqs.map(group => (
              <div key={group.category}>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-100 mb-4 pb-3 border-b border-white/10">
                  {group.category}
                </h3>
                <div className="divide-y divide-white/5">
                  {group.items.map((item, idx) => {
                    const key = `${group.category}-${idx}`;
                    const isOpen = openFaq === key;
                    return (
                      <div key={key}>
                        <button
                          onClick={() => toggleFaq(key)}
                          className="w-full py-4 flex items-start justify-between gap-4 text-left"
                        >
                          <span className="text-[13px] font-medium leading-snug text-zinc-200">{item.question}</span>
                          <span className="shrink-0 mt-0.5 text-zinc-500">
                            {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          </span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                          <p className="text-[13px] text-zinc-400 leading-relaxed pr-8">{item.answer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exchange & Return Policy */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4">Exchange & Return Policy</h2>
          <p className="text-[13px] text-zinc-400 leading-relaxed mb-10 max-w-2xl">
            {exchangeReturnPolicy.intro}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {exchangeReturnPolicy.sections.map(section => (
              <div key={section.title} className="border border-white/10 p-6 bg-ink-soft">
                <h3 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-zinc-100">{section.title}</h3>
                <ul className="space-y-2">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-[12px] text-zinc-400 leading-relaxed">
                      <span className="mt-1.5 shrink-0 w-1 h-1 rounded-full bg-accent/50" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Clothing Care */}
        <section>
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4">Clothing Care</h2>
          <p className="text-[13px] text-zinc-400 leading-relaxed mb-10 max-w-2xl">{clothingCare.intro}</p>

          <div className="mb-12">
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-6 pb-3 border-b border-white/10 text-zinc-100">
              Practical Advice
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clothingCare.practicalAdvice.map(tip => (
                <div key={tip.title} className="border border-white/10 p-5 bg-ink-soft">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest mb-2 text-zinc-100">{tip.title}</h4>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-6 pb-3 border-b border-white/10 text-zinc-100">
              Fabric Guide
            </h3>
            <div className="divide-y divide-white/5">
              {clothingCare.fabrics.map(fabric => (
                <div key={fabric.name} className="py-4 flex gap-6">
                  <span className="text-[11px] font-bold uppercase tracking-widest w-32 shrink-0 pt-0.5 text-zinc-100">
                    {fabric.name}
                  </span>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">{fabric.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-white/10 pt-16">
          <h2 className="text-[10px] uppercase tracking-[0.4em] text-accent mb-8">Still Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a
              href={`mailto:${contactInfo.email}`}
              className="border border-white/10 p-6 flex items-start gap-4 hover:border-accent transition-colors group bg-ink-soft"
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
              className="border border-white/10 p-6 flex items-start gap-4 hover:border-accent transition-colors group bg-ink-soft"
            >
              <Instagram className="w-4 h-4 mt-0.5 shrink-0 text-zinc-500 group-hover:text-accent transition-colors" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-100">Instagram</p>
                <p className="text-[12px] text-zinc-400">{contactInfo.instagram}</p>
              </div>
            </a>
            <div className="border border-white/10 p-6 flex items-start gap-4 bg-ink-soft">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-zinc-500" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-zinc-100">Support Hours</p>
                <p className="text-[12px] text-zinc-400">{contactInfo.supportHours}</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
