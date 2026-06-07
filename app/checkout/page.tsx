'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { provinceCities, OTHER_CITY } from '@/lib/pk-locations';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactInfo, setContactInfo] = useState({ email: '', firstName: '', lastName: '', address: '', apartment: '', phone: '', city: '', province: '' });
  const [provinceValue, setProvinceValue] = useState('');
  const [cityIsOther, setCityIsOther] = useState(false);
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

  const cities = provinceCities[provinceValue] || [];

  const shipping = cartTotal >= shippingThreshold ? 0 : shippingCost;
  const finalTotal = cartTotal + shipping;

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const province = formData.get('province') as string;
    const citySelection = formData.get('city') as string;
    const city = citySelection === OTHER_CITY ? ((formData.get('cityOther') as string) || '').trim() : citySelection;

    if (!email || !firstName || !lastName || !address || !phone || !city || !province) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^[\d\s+()-]{7,}$/.test(phone)) {
      setError('Please enter a valid phone number.');
      return;
    }

    setContactInfo({ email, firstName, lastName, address, apartment: formData.get('apartment') as string || '', phone, city, province });
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
      phone: contactInfo.phone,
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

  const inputCls = "w-full bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 p-4 text-sm focus:border-accent outline-none transition-colors";

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center">
        <span className="text-[10px] uppercase tracking-[0.4em] text-accent block mb-3">Checkout</span>
        <h1 className="text-5xl md:text-7xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none mb-8">
          Your Bag is <span className="italic font-[family-name:var(--font-display)] font-normal lowercase tracking-normal text-accent">Empty</span>
        </h1>
        <Link href="/products" className="bg-accent text-ink px-10 py-5 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors inline-block">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <nav className="flex text-[10px] uppercase font-bold tracking-widest text-zinc-600 mb-10">
            <span className={step === 1 ? 'text-accent' : ''}>Information & Shipping</span>
            <ChevronRight className="w-3 h-3 mx-3" />
            <span className={step === 2 ? 'text-accent' : ''}>Payment</span>
          </nav>

          <form onSubmit={step === 1 ? handleContinue : handleComplete}>
            {step === 1 ? (
              <div className="space-y-8">
                {error && <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 text-sm">{error}</div>}
                <section>
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Contact Information</h2>
                  <input name="email" type="email" required defaultValue={contactInfo.email} placeholder="Email address" className={inputCls + " mb-2"} />
                  <label className="flex items-center text-sm text-zinc-500 gap-3 mt-4">
                    <input type="checkbox" className="accent-accent w-4 h-4" />
                    Email me with news and offers
                  </label>
                </section>

                <section>
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4 mt-8">Shipping Address</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <input name="firstName" type="text" required defaultValue={contactInfo.firstName} placeholder="First name" className={inputCls} />
                    <input name="lastName" type="text" required defaultValue={contactInfo.lastName} placeholder="Last name" className={inputCls} />
                  </div>
                  <input name="address" type="text" required defaultValue={contactInfo.address} placeholder="Address" className={inputCls + " mb-4"} />
                  <input name="apartment" type="text" defaultValue={contactInfo.apartment} placeholder="Apartment, suite, etc. (optional)" className={inputCls + " mb-4"} />
                  <input name="phone" type="tel" required defaultValue={contactInfo.phone} placeholder="Phone number" className={inputCls + " mb-4"} />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <select
                      name="province"
                      required
                      className={inputCls + " appearance-none"}
                      defaultValue={contactInfo.province}
                      onChange={(e) => { setProvinceValue(e.target.value); setCityIsOther(false); }}
                    >
                      <option value="" disabled className="bg-ink text-zinc-400">Select Province</option>
                      <option value="sindh" className="bg-ink">Sindh</option>
                      <option value="punjab" className="bg-ink">Punjab</option>
                      <option value="balochistan" className="bg-ink">Balochistan</option>
                      <option value="kpk" className="bg-ink">Khyber Pakhtunkhwa</option>
                      <option value="islamabad" className="bg-ink">Islamabad</option>
                      <option value="ajk" className="bg-ink">AJK</option>
                      <option value="gb" className="bg-ink">Gilgit Baltistan</option>
                    </select>
                    <select
                      name="city"
                      key={provinceValue}
                      required
                      disabled={!provinceValue}
                      defaultValue={cities.includes(contactInfo.city) ? contactInfo.city : (contactInfo.city ? OTHER_CITY : '')}
                      onChange={(e) => setCityIsOther(e.target.value === OTHER_CITY)}
                      className={inputCls + " appearance-none disabled:opacity-40"}
                    >
                      <option value="" disabled className="bg-ink text-zinc-400">{provinceValue ? 'Select City' : 'Select province first'}</option>
                      {cities.map((c) => (
                        <option key={c} value={c} className="bg-ink">{c}</option>
                      ))}
                      <option value={OTHER_CITY} className="bg-ink">Other</option>
                    </select>
                  </div>
                  {cityIsOther && (
                    <input
                      name="cityOther"
                      type="text"
                      required
                      defaultValue={!cities.includes(contactInfo.city) ? contactInfo.city : ''}
                      placeholder="Enter your city name"
                      className={inputCls + " mb-4"}
                    />
                  )}
                </section>

                <button type="submit" className="w-full bg-accent text-ink py-5 mt-4 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors">
                  Continue to Payment
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {error && <div className="bg-red-900/30 border border-red-500/30 text-red-400 px-4 py-3 text-sm">{error}</div>}
                <section className="bg-ink-soft p-6 border border-white/10 text-sm">
                  <div className="flex justify-between flex-wrap gap-2 mb-4">
                    <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Contact</span>
                    <span className="font-semibold text-xs text-zinc-300">{contactInfo.email}</span>
                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 underline hover:text-accent transition-colors">Change</button>
                  </div>
                  <div className="w-full h-px bg-white/10 mb-4" />
                  <div className="flex justify-between flex-wrap gap-2">
                    <span className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Ship to</span>
                    <span className="font-semibold text-xs text-zinc-300">{contactInfo.address}, {contactInfo.city}, {provinceLabels[contactInfo.province] || contactInfo.province}</span>
                    <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 underline hover:text-accent transition-colors">Change</button>
                  </div>
                </section>

                <section>
                  <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4 mt-8">Payment</h2>
                  <div className="border border-white/10 bg-ink-soft mb-6">
                    <div className="p-4 flex items-center gap-3 border-b border-white/10">
                      <input type="radio" name="payment" value="cod" defaultChecked className="accent-accent w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-widest text-zinc-100">Cash on Delivery (COD)</span>
                    </div>
                    <div className="p-4 text-sm text-zinc-500">Pay with cash upon delivery.</div>
                  </div>
                </section>

                <button type="submit" disabled={loading} className="w-full bg-accent text-ink py-5 mt-4 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-white transition-colors disabled:opacity-50">
                  {loading ? 'Processing...' : `Confirm Order (PKR ${finalTotal.toLocaleString()})`}
                </button>
                <div className="text-center mt-6">
                  <button type="button" onClick={() => setStep(1)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 underline hover:text-accent transition-colors">
                    Return to shipping
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-5 bg-ink-soft p-6 md:p-10 border border-white/10 h-fit sticky top-24">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-8 hidden lg:block">Order Summary</h2>
          <div className="space-y-6 max-h-[40vh] overflow-y-auto mb-8 pr-2 border-b border-white/10 pb-6">
            {items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative w-16 h-20 bg-ink border border-white/10 shrink-0">
                  <Image src={item.product.images[0]?.url || ''} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute -top-2 -right-2 bg-accent text-ink text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                </div>
                <div className="flex-1 text-[12px] py-1">
                  <h3 className="font-bold uppercase leading-tight tracking-wide text-zinc-100">{item.product.name}</h3>
                  <p className="text-zinc-500 mt-1 uppercase tracking-tighter text-[10px]">{item.color} / {normalizeSize(item.size)}</p>
                </div>
                <div className="text-sm py-1 font-semibold text-zinc-200">PKR {(item.product.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-[11px] font-medium tracking-widest uppercase text-zinc-500">
            <div className="flex justify-between"><span>Subtotal</span><span className="text-zinc-200 font-semibold">PKR {cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-zinc-200 font-semibold">{shipping === 0 ? 'Free' : `PKR ${shipping.toLocaleString()}`}</span></div>
          </div>
          <div className="border-t border-white/10 mt-6 pt-6 flex justify-between items-baseline">
            <span className="text-[12px] uppercase font-bold tracking-widest text-zinc-100">Total</span>
            <span className="text-3xl font-bold font-[family-name:var(--font-heading)] tracking-tight text-zinc-100">PKR {finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
