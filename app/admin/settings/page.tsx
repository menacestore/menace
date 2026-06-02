'use client';

import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [shippingThreshold, setShippingThreshold] = useState('15000');
  const [shippingCost, setShippingCost] = useState('250');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setShippingThreshold(data.shipping_threshold || '15000');
        setShippingCost(data.shipping_cost || '250');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shipping_threshold: parseFloat(shippingThreshold),
        shipping_cost: parseFloat(shippingCost),
      }),
    });

    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-8">Shipping Settings</h2>

      {saved && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm mb-6">Settings saved successfully</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 border border-black/10 space-y-6 max-w-lg">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Free Shipping Threshold (PKR)</label>
          <input
            type="number"
            value={shippingThreshold}
            onChange={(e) => setShippingThreshold(e.target.value)}
            className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none"
          />
          <p className="text-xs text-gray-400 mt-2">Orders above this amount get free shipping</p>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2 block">Standard Shipping Cost (PKR)</label>
          <input
            type="number"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none"
          />
          <p className="text-xs text-gray-400 mt-2">Applied to orders below the threshold</p>
        </div>

        <button type="submit" disabled={loading} className="bg-black text-white px-8 py-4 text-[11px] uppercase tracking-widest font-bold hover:opacity-85 transition-opacity disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
