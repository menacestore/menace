import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data';
import { getColorHex, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const colors = [...new Set(product.variants?.map(v => v.color) || [])];
  const imageUrl = product.images?.[0]?.url || '';
  const secondaryImageUrl = product.images?.[1]?.url || '';
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 5;

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] bg-[#f4f4f4] mb-4 overflow-hidden border border-black/5">
        {product.newArrival && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white text-black border border-black/10 text-[9px] font-bold uppercase tracking-widest px-2 py-1">
              New
            </span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
              Sold Out
            </span>
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
              Low Stock
            </span>
          </div>
        )}
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
        {imageUrl && secondaryImageUrl && (
           <Image 
             src={secondaryImageUrl} 
             alt={`${product.name} alternate view`}
             fill
             className="object-cover object-center absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 max-lg:hidden"
             referrerPolicy="no-referrer"
           />
        )}
      </div>
      <div className="flex flex-col gap-1 mt-4">
        <div className="flex gap-1.5 mb-1">
          {colors.slice(0, 4).map(color => (
            <div 
              key={color} 
              className="w-3 h-3 border border-black/10" 
              style={{ backgroundColor: getColorHex(color) }}
              title={color}
            />
          ))}
          {colors.length > 4 && (
            <span className="text-[9px] font-medium text-gray-400 flex items-center justify-center">+{colors.length - 4}</span>
          )}
        </div>
        
        <h3 className="font-bold text-[#1a1a1a] uppercase leading-tight text-[11px] tracking-wide group-hover:text-gray-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-[#1a1a1a] text-[11px] uppercase tracking-widest font-bold mt-1">PKR {formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
