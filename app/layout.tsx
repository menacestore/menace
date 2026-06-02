import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart-context';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'MENACE | Modern E-Commerce',
  description: 'A modern e-commerce platform for shirts and accessories inspired by street fashion.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans text-[#1a1a1a] bg-white pt-20" suppressHydrationWarning>
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
