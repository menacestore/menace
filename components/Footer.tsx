import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black text-white px-4 sm:px-10 py-16 flex flex-col justify-between w-full relative z-10">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start gap-16 md:gap-12">
        {/* Logo */}
        <div>
          <Link href="/" className="inline-block transform scale-y-[1.2] origin-left pt-4">
              <span className="font-display font-medium text-4xl sm:text-6xl md:text-[5.5rem] tracking-tighter text-white">Menace</span>
          </Link>
        </div>

        {/* Links */}
        <div className="flex gap-16 md:gap-32 w-full md:w-auto mt-4 md:mt-0 justify-start md:justify-end">
          <div className="flex flex-col gap-4 text-[12px] md:text-right font-medium text-gray-200">
            <Link href="/login" className="hover:text-white transition-colors">Log In/Sign Up</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full mt-24 text-left md:text-right">
        <p className="text-[10px] font-medium text-gray-400">
          @ Copyrights Reserved by Menace {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
