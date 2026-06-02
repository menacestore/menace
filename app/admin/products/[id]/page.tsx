'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';

interface PaletteColor {
  id: string;
  name: string;
  hex: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [images, setImages] = useState<{ url: string; publicId?: string }[]>([]);
  const [variants, setVariants] = useState<{ size: string; color: string; colorId?: string; stock: number; hex?: string }[]>([]);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'shirts',
    featured: false,
    newArrival: false,
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products/${id}`).then(r => r.json()),
      fetch('/api/admin/colors').then(r => r.json()),
    ]).then(([productRes, colorsRes]) => {
      const p = productRes.data;
      setPalette(colorsRes.data || []);
      setFormData({
        name: p.name,
        description: p.description,
        price: p.price.toString(),
        category: p.category,
        featured: p.featured,
        newArrival: p.newArrival,
      });
      setImages(p.images || []);
      const normalizeSize = (s: string) => {
        const map: Record<string, string> = { small: 'S', medium: 'M', large: 'L', 'extra large': 'XL', 'extra-large': 'XL', extralarge: 'XL' };
        return map[s.toLowerCase()] || s;
      };
      setVariants((p.variants || []).map((v: any) => ({ ...v, size: normalizeSize(v.size) })));
      setFetching(false);
    });
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadToCloudinary(file);
      setImages(prev => [...prev, { url: result.url, publicId: result.publicId }]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }

    setUploading(false);
    e.target.value = '';
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  const addVariant = () => setVariants(prev => [...prev, { size: 'S', color: '', stock: 0 }]);

  const updateVariant = (index: number, field: string, value: string | number) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const selectColor = (index: number, colorId: string) => {
    const c = palette.find(p => p.id === colorId);
    if (!c) return;
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, colorId: c.id, color: c.name, hex: c.hex } : v));
  };

  const removeVariant = (index: number) => setVariants(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    if (variants.length === 0) {
      setError('Please add at least one variant (size, color, stock)');
      return;
    }
    
    for (let i = 0; i < variants.length; i++) {
      if (!variants[i].color.trim()) {
        setError(`Variant ${i + 1}: Color is required`);
        return;
      }
    }
    
    setLoading(true);
    setError('');

    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        images,
        variants,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      const msg = err.details
        ? err.details.map((d: any) => d.message).join(', ')
        : (err.error || 'Failed to update product');
      setError(msg);
    } else {
      router.push('/admin/products');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/admin/products');
  };

  if (fetching) return <p className="p-8">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-display">Edit Product</h2>
        <button onClick={() => router.back()} className="text-[11px] uppercase tracking-widest text-gray-500 hover:text-black">
          ← Back
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-black/10 space-y-6 max-w-2xl">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Name</label>
          <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none" />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Description</label>
          <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required rows={4} className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Price (PKR)</label>
            <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Category</label>
            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none">
              <option value="shirts">Shirts</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="accent-black" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.newArrival} onChange={e => setFormData({ ...formData, newArrival: e.target.checked })} className="accent-black" />
            New Arrival
          </label>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Images</label>
          <label className="border border-black/10 bg-[#fbfbfb] px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 inline-block mb-4">
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          <div className="grid grid-cols-4 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square bg-gray-100 border border-black/10">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black text-white text-[9px] w-5 h-5 flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Variants (Size / Color / Stock)</label>
            <button type="button" onClick={addVariant} className="text-[10px] uppercase tracking-widest text-blue-600 hover:underline">+ Add</button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <select value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} className="border border-black/10 bg-[#fbfbfb] p-2 text-sm w-20 focus:border-black outline-none">
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              {palette.length > 0 ? (
                <div className="relative w-40">
                  <select
                    value={v.colorId || ''}
                    onChange={e => selectColor(i, e.target.value)}
                    className="border border-black/10 bg-[#fbfbfb] p-2 text-sm w-full focus:border-black outline-none appearance-none pl-8"
                  >
                    <option value="">Select color</option>
                    {palette.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {v.hex && (
                    <div
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: v.hex }}
                    />
                  )}
                </div>
              ) : (
                <input placeholder="Color" value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} className="border border-black/10 bg-[#fbfbfb] p-2 text-sm w-24 focus:border-black outline-none" />
              )}
              <input type="number" placeholder="Stock" value={v.stock} onChange={e => updateVariant(i, 'stock', parseInt(e.target.value) || 0)} className="border border-black/10 bg-[#fbfbfb] p-2 text-sm w-20 focus:border-black outline-none" />
              <button type="button" onClick={() => removeVariant(i)} className="text-red-500 text-sm">×</button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="flex-1 bg-black text-white py-5 text-[11px] uppercase tracking-widest font-bold hover:opacity-85 transition-opacity disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={handleDelete} className="px-6 border border-red-300 text-red-600 py-5 text-[11px] uppercase tracking-widest font-bold hover:bg-red-50">
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
