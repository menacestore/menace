'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/cart-context';
import { Plus, ShoppingBag, Minus } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getColorHex, formatPrice } from '@/lib/utils';
import { productComposition, sizeChart, deliveriesAndReturns } from '@/lib/product-details';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { addItem, setIsCartOpen } = useCart();

  const variants = product.variants || [];
  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Map(
    variants.map(v => [v.color.trim().toLowerCase(), v.color.trim()])
  ).values()];

  const normalizeSize = (s: string) => {
    const map: Record<string, string> = { small: 'S', medium: 'M', large: 'L', 'extra large': 'XL', 'extra-large': 'XL', extralarge: 'XL' };
    return map[s.toLowerCase().trim()] || s.trim();
  };

  const displaySizes = sizes.map(normalizeSize);

  const colorMap: Record<string, string> = {};
  variants.forEach(v => { if (v.color && v.hex) colorMap[v.color.trim().toLowerCase()] = v.hex; });
  const getHex = (color: string) => colorMap[color.trim().toLowerCase()] || getColorHex(color);

  const firstInStock = variants.find(v => v.stock > 0);
  const defaultSize = firstInStock ? firstInStock.size : (sizes[0] || '');
  const defaultColor = firstInStock ? firstInStock.color : (colors[0] || '');

  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const selectedVariant = variants.find(
    v => v.size.trim().toLowerCase() === selectedSize.trim().toLowerCase()
      && v.color.trim().toLowerCase() === selectedColor.trim().toLowerCase()
  );
  const currentStock = selectedVariant?.stock || 0;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) { setError('Please select a size and color.'); return; }
    if (currentStock === 0) { setError('This variant is out of stock.'); return; }
    setError('');
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleSection = (section: string) => setExpandedSection(prev => prev === section ? null : section);

  const imageUrls = product.images?.filter(img => img.url).map(img => img.url) || [];

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row">
        {/* Images */}
        <div className="w-full lg:w-[65%] xl:w-[70%]">
          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 p-1">
              {imageUrls.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-ink-soft">
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    className="object-cover object-center"
                    priority={idx < 2}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-[3/4] bg-ink-soft flex items-center justify-center">
              <p className="text-zinc-600 text-sm">No images available</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[35%] xl:w-[30%] px-6 py-10 lg:py-12 lg:px-12 border-t lg:border-t-0 lg:border-l border-white/10">
          <div className="sticky top-28">
            <h1 className="text-sm font-bold uppercase tracking-wide leading-snug mb-2 text-zinc-100">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-accent mb-6 uppercase tracking-wide">
              PKR {formatPrice(product.price)}
            </p>

            {/* Color */}
            <div className="mb-8">
              <span className="text-[11px] text-zinc-500 mb-3 block capitalize">{selectedColor}</span>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 border transition-all ${
                      selectedColor === color
                        ? 'ring-1 ring-accent ring-offset-2 ring-offset-ink border-accent/50'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                    style={{ backgroundColor: getHex(color) }}
                    title={color}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Select Size</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {displaySizes.map((displaySize, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedSize(sizes[idx]); setQuantity(1); }}
                    className={`text-[12px] uppercase transition-all ${
                      selectedSize === sizes[idx]
                        ? 'text-accent font-bold underline underline-offset-4'
                        : 'text-zinc-500 hover:text-zinc-100 font-medium'
                    }`}
                  >
                    {displaySize}
                  </button>
                ))}
              </div>
              {currentStock > 0 && currentStock <= 5 && (
                <p className="text-[10px] text-red-400 font-semibold uppercase tracking-widest mt-2">Only {currentStock} left</p>
              )}
              {currentStock === 0 && selectedSize && selectedColor && (
                <p className="text-[10px] text-red-400 font-semibold uppercase tracking-widest mt-2">Out of stock</p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Quantity</span>
              <div className="flex items-center gap-3 border border-white/10 px-3 py-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-zinc-500 hover:text-zinc-100 transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(currentStock || 99, q + 1))}
                  className="text-zinc-500 hover:text-zinc-100 transition-colors disabled:opacity-30"
                  disabled={quantity >= (currentStock || 99)}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className={`w-full px-6 py-4 font-bold uppercase tracking-[0.1em] text-[12px] transition-all flex items-center justify-between ${
                added ? 'bg-green-600 text-white hover:bg-green-700'
                : currentStock === 0 ? 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/10'
                : 'bg-accent text-ink hover:bg-white'
              }`}
            >
              <span>{added ? 'Added to Cart ✓' : currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              {!added && currentStock > 0 && <ShoppingBag className="w-5 h-5 stroke-[1.5]" />}
            </button>
            {error && <p className="text-red-400 text-xs font-semibold uppercase tracking-widest mt-2">{error}</p>}

            {/* Description */}
            <div className="mt-10 mb-8">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-100 mb-4">Product Description</h3>
              <p className="text-[13px] text-zinc-400 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {/* Accordion */}
            <div className="border-t border-white/10">
              {[
                { id: 'size', title: 'Size Guide', content: (
                  <div className="text-sm text-zinc-300 space-y-4">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-zinc-400">
                          {sizeChart.columns.map(col => (
                            <th key={col} className="pb-2 pr-4 font-bold">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-[11px]">
                        {sizeChart.rows.map(row => (
                          <tr key={row.size} className="border-b border-white/5">
                            <td className="py-2 pr-4 font-bold text-zinc-100">{row.size}</td>
                            <td className="py-2 pr-4 text-zinc-400">{row.length}</td>
                            <td className="py-2 pr-4 text-zinc-400">{row.chest}</td>
                            <td className="py-2 text-zinc-400">{row.sleeve}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-[10px] text-zinc-500 mt-3">All measurements are in {sizeChart.unit}.</p>
                  </div>
                )},
                { id: 'details', title: 'Product Details & Composition', content: (
                  <div className="text-[12px] text-zinc-300 space-y-4">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-100">{productComposition.fit.label}</span>
                      <p className="mt-1 text-zinc-400">{productComposition.fit.value}</p>
                      <p className="mt-1 leading-relaxed text-zinc-400">{productComposition.fit.description}</p>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-100">Composition</span>
                      <p className="mt-1 text-zinc-400">{productComposition.composition}</p>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-100">Care Instructions</span>
                      <ul className="mt-2 space-y-1">
                        {productComposition.care.map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-400">
                            <span className="mt-0.5 shrink-0"></span>{line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )},
                { id: 'delivery', title: 'Deliveries & Returns', content: (
                  <div className="text-[12px] text-zinc-300 space-y-4">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-100">{deliveriesAndReturns.delivery.label}</span>
                      <ul className="mt-2 space-y-1">
                        {deliveriesAndReturns.delivery.lines.map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-400">
                            <span className="mt-0.5 shrink-0"></span>{line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-100">{deliveriesAndReturns.returns.label}</span>
                      <p className="mt-2 leading-relaxed text-zinc-400">{deliveriesAndReturns.returns.intro}</p>
                      <ul className="mt-2 space-y-1">
                        {deliveriesAndReturns.returns.conditions.map((condition, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-400">
                            <span className="mt-0.5 shrink-0"></span>{condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              ].map(section => (
                <div key={section.id} className="border-b border-white/10">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="w-4 flex items-center justify-center text-zinc-600">
                      {expandedSection === section.id ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-300">
                      {section.title}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${expandedSection === section.id ? 'max-h-[600px] pb-4 pl-8' : 'max-h-0'}`}>
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-16 px-4 sm:px-6 lg:px-8 mb-24 max-w-[1600px] mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-100 mb-8">You May Also Like</h2>
          <div className={`grid gap-4 ${
            relatedProducts.length === 1 ? 'grid-cols-1 max-w-sm' :
            relatedProducts.length === 2 ? 'grid-cols-2' :
            relatedProducts.length === 3 ? 'grid-cols-3' :
            relatedProducts.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
          }`}>
            {relatedProducts.map(related => (
              <ProductCard key={related.id} product={related} variant="dark" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
