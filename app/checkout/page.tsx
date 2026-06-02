'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactInfo, setContactInfo] = useState({ email: '', firstName: '', lastName: '', address: '', apartment: '', city: '', province: '' });
  const [shippingThreshold, setShippingThreshold] = useState(15000);
  const [shippingCost, setShippingCost] = useState(250);

  useEffect(() => {
    fetch('/api/shipping-settings')
      .then(res => res.json())
      .then(data => {
        setShippingThreshold(data.shippingThreshold);
        setShippingCost(data.shippingCost);
      })
      .catch(() => {
        // fall back to defaults
      });
  }, []);

  const normalizeSize = (s: string) => {
    const map: Record<string, string> = { small: 'S', medium: 'M', large: 'L', 'extra large': 'XL', 'extra-large': 'XL', extralarge: 'XL' };
    return map[s.toLowerCase()] || s;
  };

  const provinceLabels: Record<string, string> = {
    sindh: 'Sindh',
    punjab: 'Punjab',
    balochistan: 'Balochistan',
    kpk: 'Khyber Pakhtunkhwa',
    islamabad: 'Islamabad',
    ajk: 'AJK',
    gb: 'Gilgit Baltistan',
  };

  const tax = cartTotal * 0.18;
  const shipping = cartTotal >= shippingThreshold ? 0 : shippingCost;
  const finalTotal = cartTotal + tax + shipping;

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const province = formData.get('province') as string;

    if (!email || !firstName || !lastName || !address || !city || !province) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setContactInfo({ email, firstName, lastName, address, apartment: formData.get('apartment') as string || '', city, province });
    setStep(2);
  };

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const shippingAddress = {
      firstName: contactInfo.firstName,
      lastName: contactInfo.lastName,
      address: contactInfo.address,
      apartment: contactInfo.apartment,
      city: contactInfo.city,
      province: contactInfo.province,
    };

    const orderItems = items.map(item => ({
      productId: item.product.id,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.product.price,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactInfo.email,
          items: orderItems,
          shippingAddress,
          paymentMethod: 'cod',
          userId: (session?.user as any)?.id || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create order');
      } else {
        clearCart();
        router.push(`/order/${data.orderId}`);
      }
    } catch {
      setError('Something went wrong');
    }

    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Your Bag is <span className="italic font-normal">Empty</span></h1>
        <Link href="/products" className="bg-transparent border border-black text-[#1a1a1a] px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-black hover:text-white transition-colors inline-block mx-auto">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <nav className="flex text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-10">
            <span className={step === 1 ? 'text-[#1a1a1a]' : ''}>Information & Shipping</span>
            <ChevronRight className="w-3 h-3 mx-3" />
            <span className={step === 2 ? 'text-[#1a1a1a]' : ''}>Payment</span>
          </nav>

          <form onSubmit={step === 1 ? handleContinue : handleComplete}>
            {step === 1 ? (
              <div className="space-y-8">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>}
                <section>
                  <h2 className="text-xl font-display font-bold mb-4">Contact Information</h2>
                  <input name="email" type="email" required placeholder="Email address" className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm mb-2 focus:border-black outline-none transition-colors" />
                  <label className="flex items-center text-sm text-gray-600 gap-3 mt-4">
                    <input type="checkbox" className="accent-black w-4 h-4" />
                    Email me with news and offers
                  </label>
                </section>

                <section>
                  <h2 className="text-xl font-display font-bold mb-4 mt-8">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input name="firstName" type="text" required placeholder="First name" className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors" />
                    <input name="lastName" type="text" required placeholder="Last name" className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors" />
                  </div>
                  <input name="address" type="text" required placeholder="Address" className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm mb-4 focus:border-black outline-none transition-colors" />
                  <input name="apartment" type="text" placeholder="Apartment, suite, etc. (optional)" className="w-full border border-black/10 bg-[#fbfbfb] p-4 text-sm mb-4 focus:border-black outline-none transition-colors" />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input name="city" type="text" required placeholder="City" className="col-span-1 border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors" />
                    <select name="province" required className="col-span-1 border border-black/10 bg-[#fbfbfb] p-4 text-sm focus:border-black outline-none transition-colors appearance-none" defaultValue="">
                      <option value="" disabled>Select Province</option>
                      <option value="sindh">Sindh</option>
                      <option value="punjab">Punjab</option>
                      <option value="balochistan">Balochistan</option>
                      <option value="kpk">Khyber Pakhtunkhwa</option>
                      <option value="islamabad">Islamabad</option>
                      <option value="ajk">AJK</option>
                      <option value="gb">Gilgit Baltistan</option>
                    </select>
                  </div>
                </section>

                <button type="submit" className="w-full bg-[#1a1a1a] text-white py-5 mt-4 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity">
                  Continue to Payment
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>}
                <section className="bg-[#fbfbfb] p-6 border border-black/10 text-sm">
                  <div className="flex justify-between flex-wrap gap-2 mb-4">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Contact</span>
                    <span className="font-semibold text-xs">{contactInfo.email}</span>
                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 underline hover:text-[#1a1a1a]">Change</button>
                  </div>
                  <div className="w-full h-px bg-black/10 mb-4" />
                  <div className="flex justify-between flex-wrap gap-2">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Ship to</span>
                    <span className="font-semibold text-xs">{contactInfo.address}, {contactInfo.city}, {provinceLabels[contactInfo.province] || contactInfo.province}</span>
                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 underline hover:text-[#1a1a1a]">Change</button>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-display font-bold mb-4 mt-8">Payment</h2>
                  <div className="border border-black/10 bg-white mb-6">
                    <div className="p-4 bg-[#fbfbfb] flex items-center gap-3">
                      <input type="radio" name="payment" value="cod" defaultChecked className="accent-black w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-widest text-[#1a1a1a]">Cash on Delivery (COD)</span>
                    </div>
                    <div className="p-4 text-sm text-gray-600">Pay with cash upon delivery.</div>
                  </div>
                </section>

                <button type="submit" disabled={loading} className="w-full bg-[#1a1a1a] text-white py-5 mt-4 font-bold uppercase tracking-[0.2em] text-[11px] hover:opacity-85 transition-opacity disabled:opacity-50">
                  {loading ? 'Processing...' : `Confirm Order (PKR ${finalTotal.toLocaleString()})`}
                </button>
                <div className="text-center mt-6">
                  <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 underline hover:text-[#1a1a1a]">
                    Return to shipping
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="lg:col-span-5 bg-[#fbfbfb] p-6 md:p-10 border border-black/10 h-fit sticky top-24">
          <h2 className="text-2xl font-display font-bold mb-8 hidden lg:block">Order Summary</h2>
          <div className="space-y-6 max-h-[40vh] overflow-y-auto mb-8 pr-2 border-b border-black/10 pb-6">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative w-16 h-20 bg-[#f4f4f4] border border-black/5 shrink-0">
                  <Image src={item.product.images[0]?.url || ''} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute -top-2 -right-2 bg-[#1a1a1a] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                </div>
                <div className="flex-1 text-[12px] py-1">
                  <h3 className="font-bold uppercase leading-tight tracking-wide">{item.product.name}</h3>
                  <p className="text-gray-400 mt-1 uppercase tracking-tighter text-[10px]">{item.color} / {normalizeSize(item.size)}</p>
                </div>
                <div className="text-sm py-1 font-semibold">PKR {(item.product.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-[11px] font-medium tracking-widest uppercase text-gray-500">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-[#1a1a1a] font-semibold">PKR {cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-[#1a1a1a] font-semibold">{shipping === 0 ? 'Free' : `PKR ${shipping.toLocaleString()}`}</span></div>
            <div className="flex justify-between"><span>Estimated Tax (18% GST)</span><span className="text-[#1a1a1a] font-semibold">PKR {tax.toLocaleString()}</span></div>
          </div>
          <div className="border-t border-black/10 mt-6 pt-6 flex justify-between items-baseline">
            <span className="text-[12px] uppercase font-bold tracking-widest">Total</span>
            <span className="text-3xl font-bold font-display tracking-tight">PKR {finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
