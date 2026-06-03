'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  const handleSearchSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const openSearch = () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(true);
  };

  const navLinks = [
    { name: 'Shirts', href: '/products/shirts' },
    { name: 'Track Orders', href: '/order/track' },
  ];

  const isHome = pathname === '/';

  const headerBg = isScrolled
    ? 'bg-ink/90 backdrop-blur-md border-white/10'
    : isHome
      ? 'bg-transparent border-transparent'
      : 'bg-ink border-white/10';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 h-20 flex items-center px-4 sm:px-10 border-b text-zinc-100 ${headerBg}`}
      >
        {isSearchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex w-full items-center gap-3">
            <Search className="w-5 h-5 shrink-0 opacity-50" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-sm tracking-wide placeholder:opacity-40"
            />
            <button
              type="button"
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
              className="p-1 transition-opacity hover:opacity-70"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-3 w-full items-center">
            <div className="flex items-center justify-start">
               <button
                 className="lg:hidden p-2 -ml-2 mr-4"
                 onClick={() => setIsMobileMenuOpen(true)}
               >
                 <Menu className="w-6 h-6" />
               </button>

              <nav className="hidden lg:flex items-center space-x-8 uppercase text-[11px] tracking-[0.2em] font-semibold">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-opacity hover:opacity-100 ${
                      isActive(link.href) ? 'border-b border-current opacity-100' : 'opacity-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center justify-center">
              <Link
                href="/"
                className="font-display font-bold text-2xl sm:text-3xl tracking-tight uppercase"
              >
                MENACE
              </Link>
            </div>

            <div className="flex items-center space-x-4 sm:space-x-6 justify-end">
              {pathname !== '/search' && (
                <button
                  onClick={openSearch}
                  className="flex text-[11px] items-center justify-center tracking-widest uppercase font-semibold transition-opacity hover:opacity-70"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              {session?.user ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="hidden sm:flex text-[11px] items-center justify-center tracking-widest uppercase font-semibold transition-opacity hover:opacity-70"
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" className="hidden sm:flex text-[11px] items-center justify-center tracking-widest uppercase font-semibold transition-opacity hover:opacity-70">
                  <User className="w-5 h-5" />
                </Link>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-[11px] flex items-center justify-center tracking-widest uppercase font-semibold relative transition-opacity hover:opacity-70"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-ink text-[9px] font-bold px-1 py-0.5 rounded-full inline-flex items-center justify-center min-w-[16px] h-[16px]">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <div
        className={`fixed top-0 left-0 z-50 w-72 max-w-[80vw] bg-ink-soft border-r border-white/10 h-full shadow-xl flex flex-col transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="font-[family-name:var(--font-heading)] font-bold text-2xl tracking-tight uppercase text-zinc-100">
            MENACE
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-[12px] font-bold tracking-[0.2em] uppercase transition-colors ${
                isActive(link.href) ? 'text-accent underline underline-offset-4' : 'text-zinc-500 hover:text-zinc-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-6 flex flex-col gap-4 border-t border-white/10">
          {session?.user ? (
            <button
              onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
              className="flex items-center gap-3 text-[12px] font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-[12px] font-bold tracking-[0.2em] uppercase text-zinc-400 hover:text-zinc-100 transition-colors">
              <User className="w-4 h-4" /> Account
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
