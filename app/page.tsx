import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { query } from '@/lib/db';
import { formatProduct } from '@/lib/format';

async function getFeaturedProducts() {
  const products = await query(`
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.category,
      p.featured,
      p.new_arrival AS "newArrival",
      json_agg(
        json_build_object(
          'id', pi.id,
          'url', pi.cloudinary_url,
          'alt', pi.alt_text,
          'sortOrder', pi.sort_order
        ) ORDER BY pi.sort_order
      ) FILTER (WHERE pi.id IS NOT NULL) AS images,
      json_agg(
        json_build_object(
          'id', pv.id,
          'size', pv.size,
          'color', pv.color,
          'stock', pv.stock
        )
      ) FILTER (WHERE pv.id IS NOT NULL) AS variants
    FROM products p
    LEFT JOIN product_images pi ON pi.product_id = p.id
    LEFT JOIN product_variants pv ON pv.product_id = p.id
    WHERE p.featured = true
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT 4
  `);

  return products.map(formatProduct);
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="flex flex-col bg-ink text-zinc-100 -mt-20">
      {/* HERO — full-bleed banner behind the transparent navbar */}
      <section className="relative aspect-[16/9] md:aspect-auto md:h-screen md:min-h-[560px] flex items-end justify-center overflow-hidden bg-ink">
        <Image
          src="/heropage.PNG"
          alt="MENACE — Welcome to the dark side of streetwear"
          fill
          className="object-contain md:object-cover object-center"
          priority
        />
        {/* darken edges + a bottom gradient so the CTA stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 md:from-black/70 md:via-transparent md:to-black/40" />

        <div className="relative z-10 text-center px-4 pb-8 md:pb-20 max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/products"
              className="bg-accent text-ink px-12 py-5 font-bold uppercase tracking-[0.25em] text-[11px] hover:bg-white transition-colors inline-block"
            >
              Shop Now
            </Link>
          </div>
          <span className="mt-6 text-[10px] uppercase tracking-[0.4em] text-zinc-400">Scroll to enter</span>
        </div>
      </section>

      {/* MARQUEE — echoes the banner tagline */}
      <div className="bg-accent text-ink overflow-hidden py-3 border-y border-white/10">
        <div className="flex w-max animate-marquee">
          {[0, 1].map(group => (
            <div key={group} className="flex shrink-0 text-[11px] font-bold uppercase tracking-[0.3em]" aria-hidden={group === 1}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mx-6 flex items-center gap-6">
                  Welcome to the dark side of streetwear <span className="opacity-50">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED DROPS */}
      <section className="relative bg-fog grain py-24 w-full overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-end justify-between mb-16 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-[10px] uppercase tracking-widest text-accent">Curated for the bold</span>
                <div className="h-px w-12 bg-white/20"></div>
              </div>
              <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none">
                Featured <span className="font-display italic font-normal lowercase tracking-normal text-accent">drops</span>
              </h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-300 hover:text-accent transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} variant="dark" />
            ))}
          </div>

          <div className="mt-16 sm:hidden flex justify-center border-t border-white/10 pt-8">
            <Link href="/products" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-300 hover:text-accent transition-colors">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="relative bg-ink-soft grain border-y border-white/10 py-28 px-4 overflow-hidden">
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-accent">The Menace Ethos</span>
          <h2 className="mt-6 text-4xl md:text-6xl font-[family-name:var(--font-heading)] uppercase leading-[0.95] tracking-tight text-white">
            Engineered for the <span className="text-accent">dark side</span> of streetwear
          </h2>
          <p className="mt-8 max-w-xl mx-auto text-sm md:text-base text-zinc-400 font-light leading-relaxed">
            Precision-crafted garments for those who refuse the ordinary. Bold silhouettes, uncompromising detail, built to be worn after dark.
          </p>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="bg-ink border-t border-white/10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {[
            { icon: Sparkles, title: 'Premium Fabric', copy: 'Heavyweight, built-to-last garments engineered for the long haul.' },
            { icon: ShieldCheck, title: 'Secure Checkout', copy: 'Your order and details are protected at every step.' },
            { icon: Truck, title: 'Order Tracking', copy: 'Follow your drop from our hands to your door.', href: '/order/track' },
          ].map(({ icon: Icon, title, copy, href }) => {
            const content = (
              <div className="flex flex-col items-center text-center px-6 py-12 sm:py-16 h-full group">
                <Icon className="w-7 h-7 text-accent mb-5" strokeWidth={1.5} />
                <h3 className="text-[12px] font-bold uppercase tracking-[0.25em] text-white mb-3 group-hover:text-accent transition-colors">
                  {title}
                </h3>
                <p className="text-[12px] text-zinc-400 font-light leading-relaxed max-w-[15rem]">{copy}</p>
              </div>
            );
            return href ? (
              <Link key={title} href={href}>{content}</Link>
            ) : (
              <div key={title}>{content}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
