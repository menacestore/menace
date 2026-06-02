import React from 'react';
import Link from 'next/link';

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/products' },
      { name: 'Shirts', href: '/products/shirts' },
      { name: 'Search', href: '/search' },
    ],
  },
  {
    title: 'Support',
    links: [
      { name: 'Track Order', href: '/order/track' },
      { name: 'Shopping Guide', href: '/shopping-guide' },
      { name: 'Contact Us', href: '#' },
    ],
  },
  {
    title: 'Account',
    links: [
      { name: 'Log In', href: '/login' },
      { name: 'Create Account', href: '/register' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-ink text-zinc-300 border-t-2 border-accent w-full overflow-hidden">
      {/* Brand band */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-10 pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Link href="/" className="inline-block">
            <span className="font-[family-name:var(--font-heading)] uppercase text-6xl sm:text-7xl tracking-tight text-white leading-none">
              Menace
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-[11px] uppercase tracking-[0.3em] text-accent">
            Welcome to the dark side of streetwear
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
          {footerLinks.map(col => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-white">{col.title}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-zinc-400 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            © {new Date().getFullYear()} Menace — All rights reserved
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Crafted in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
