'use client';

import { useState, useEffect } from 'react';

interface Color {
  id: string;
  name: string;
  hex: string;
  slug: string;
}

export default function AdminColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', hex: '#000000' });

  const fetchColors = async () => {
    const res = await fetch('/api/admin/colors');
    const data = await res.json();
    setColors(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchColors(); }, []);

  const handleCreate = async () => {
    setError('');
    const res = await fetch('/api/admin/colors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || 'Failed to create color');
      return;
    }
    setForm({ name: '', hex: '#000000' });
    fetchColors();
  };

  const handleUpdate = async (id: string) => {
    setError('');
    const res = await fetch(`/api/admin/colors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json();
      setError(err.error || 'Failed to update color');
      return;
    }
    setEditingId(null);
    setForm({ name: '', hex: '#000000' });
    fetchColors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this color? Variants using it will be unlinked.')) return;
    await fetch(`/api/admin/colors/${id}`, { method: 'DELETE' });
    fetchColors();
  };

  const startEdit = (c: Color) => {
    setEditingId(c.id);
    setForm({ name: c.name, hex: c.hex });
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold font-display">Color Palette</h2>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}

      <div className="bg-white p-6 border border-black/10 mb-8 max-w-md">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">
          {editingId ? 'Edit Color' : 'Add New Color'}
        </h3>
        <div className="flex items-end gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1 block">Color</label>
            <input
              type="color"
              value={form.hex}
              onChange={e => setForm({ ...form, hex: e.target.value })}
              className="w-12 h-12 p-0.5 border border-black/10 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Navy Blue"
              className="w-full border border-black/10 bg-[#fbfbfb] p-3 text-sm focus:border-black outline-none"
            />
          </div>
          <button
            onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
            disabled={!form.name.trim()}
            className="bg-black text-white px-5 py-3 text-[10px] uppercase tracking-widest font-bold hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
          >
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setForm({ name: '', hex: '#000000' }); }}
              className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {colors.map(c => (
          <div key={c.id} className="bg-white border border-black/10 p-4 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: c.hex }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{c.name}</p>
              <p className="text-[10px] text-gray-400 font-mono">{c.hex}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => startEdit(c)} className="text-[10px] text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="text-[10px] text-red-600 hover:underline">Del</button>
            </div>
          </div>
        ))}
      </div>

      {colors.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-16">No colors defined yet. Add your first color above.</p>
      )}
    </div>
  );
}
