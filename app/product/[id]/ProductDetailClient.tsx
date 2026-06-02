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
    if (!selectedSize || !selectedColor) {
      setError('Please select a size and color.');
      return;
    }
    if (currentStock === 0) {
      setError('This variant is out of stock.');
      return;
    }
    setError('');
    addItem(product, selectedSize, selectedColor, quantity);
    setAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  const imageUrls = product.images?.filter(img => img.url).map(img => img.url) || [];
  const displayImages = imageUrls.length > 0 ? imageUrls : [];

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[65%] xl:w-[70%]">
          {displayImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-1 p-1">
              {displayImages.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-[#f4f4f4]">
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
            <div className="aspect-[3/4] bg-[#f4f4f4] flex items-center justify-center">
              <p className="text-gray-400 text-sm">No images available</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[35%] xl:w-[30%] px-6 py-10 lg:py-12 lg:px-12">
          <div className="sticky top-28">
            <h1 className="text-sm font-bold uppercase tracking-wide leading-snug mb-2 font-sans text-[#1a1a1a]">
              {product.name}
            </h1>
            <p className="text-sm font-bold text-[#1a1a1a] mb-2 uppercase tracking-wide">
              PKR {formatPrice(product.price)}
            </p>

            <div className="mb-8">
              <span className="text-[11px] text-gray-500 mb-3 block capitalize">{selectedColor}</span>
              <div className="flex flex-wrap gap-2">
                {colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 border transition-all ${
                      selectedColor === color 
                        ? 'ring-1 ring-black ring-offset-2 border-black/20' 
                        : 'border-black/10 hover:border-black/30'
                    }`}
                    style={{ backgroundColor: getHex(color) }}
                    title={color}
                    aria-label={`Select ${color} color`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Select Size</span>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {displaySizes.map((displaySize, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setSelectedSize(sizes[idx]); setQuantity(1); }}
                    className={`text-[12px] uppercase transition-all ${
                      selectedSize === sizes[idx]
                        ? 'text-[#1a1a1a] font-bold underline underline-offset-4'
                        : 'text-gray-500 hover:text-[#1a1a1a] font-medium'
                    }`}
                  >
                    {displaySize}
                  </button>
                ))}
              </div>
              {currentStock > 0 && currentStock <= 5 && (
                <p className="text-[10px] text-red-600 font-semibold uppercase tracking-widest mt-2">Only {currentStock} left</p>
              )}
              {currentStock === 0 && selectedSize && selectedColor && (
                <p className="text-[10px] text-red-600 font-semibold uppercase tracking-widest mt-2">Out of stock</p>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-600">Quantity</span>
              <div className="flex items-center gap-3 border border-black/10 px-3 py-2">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-gray-500 hover:text-black transition-colors disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(currentStock || 99, q + 1))}
                  className="text-gray-500 hover:text-black transition-colors disabled:opacity-30"
                  disabled={quantity >= (currentStock || 99)}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className={`w-full text-white px-6 py-4 font-bold uppercase tracking-[0.1em] text-[12px] transition-all flex items-center justify-between ${
                added ? 'bg-green-600 hover:bg-green-700' : currentStock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1a1a1a] hover:bg-black'
              }`}
            >
              <span>{added ? 'Added to Cart ✓' : currentStock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              {!added && currentStock > 0 && <ShoppingBag className="w-5 h-5 stroke-[1.5]" />}
            </button>
            {error && <p className="text-red-500 text-xs font-semibold uppercase tracking-widest mt-2">{error}</p>}

            <div className="mt-10 mb-8">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#1a1a1a] mb-4">Product Description</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div className="border-t border-black/10">
              {[
                { id: 'size', title: 'Size Guide', content: (
                  <div className="text-sm text-[#1a1a1a] space-y-4">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-black/10 text-[10px] uppercase tracking-widest text-[#1a1a1a]">
                          {sizeChart.columns.map(col => (
                            <th key={col} className="pb-2 pr-4 font-bold">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-[11px]">
                        {sizeChart.rows.map(row => (
                          <tr key={row.size} className="border-b border-black/5">
                            <td className="py-2 pr-4 font-bold text-[#1a1a1a]">{row.size}</td>
                            <td className="py-2 pr-4">{row.length}</td>
                            <td className="py-2 pr-4">{row.chest}</td>
                            <td className="py-2">{row.sleeve}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-[10px] text-[#1a1a1a] mt-3">All measurements are in {sizeChart.unit}.</p>
                  </div>
                )},
                { id: 'details', title: 'Product Details & Composition', content: (
                  <div className="text-[12px] text-[#1a1a1a] space-y-4">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest">{productComposition.fit.label}</span>
                      <p className="mt-1">{productComposition.fit.value}</p>
                      <p className="mt-1 leading-relaxed">{productComposition.fit.description}</p>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest">Composition</span>
                      <p className="mt-1">{productComposition.composition}</p>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest">Care Instructions</span>
                      <ul className="mt-2 space-y-1">
                        {productComposition.care.map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0"></span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )},
                { id: 'delivery', title: 'Deliveries & Returns', content: (
                  <div className="text-[12px] text-[#1a1a1a] space-y-4">
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest">{deliveriesAndReturns.delivery.label}</span>
                      <ul className="mt-2 space-y-1">
                        {deliveriesAndReturns.delivery.lines.map((line, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0"></span>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[12px] font-bold uppercase tracking-widest">{deliveriesAndReturns.returns.label}</span>
                      <p className="mt-2 leading-relaxed">{deliveriesAndReturns.returns.intro}</p>
                      <ul className="mt-2 space-y-1">
                        {deliveriesAndReturns.returns.conditions.map((condition, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 shrink-0"></span>
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              ].map(section => (
                <div key={section.id} className="border-b border-black/10">
                  <button 
                    onClick={() => toggleSection(section.id)}
                    className="w-full py-4 flex items-center gap-4 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="w-4 flex items-center justify-center text-gray-400">
                      {expandedSection === section.id ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-widest text-[#1a1a1a]">
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

      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-black/10 pt-16 px-4 sm:px-6 lg:px-8 mb-24 max-w-[1600px] mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#1a1a1a] mb-8">You May Also Like</h2>
          <div className={`grid gap-4 ${
            relatedProducts.length === 1 ? 'grid-cols-1 max-w-sm' :
            relatedProducts.length === 2 ? 'grid-cols-2' :
            relatedProducts.length === 3 ? 'grid-cols-3' :
            relatedProducts.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
            'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
          }`}>
            {relatedProducts.map(related => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
