'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/3d-testimonials';

const testimonials = [
  {
    name: 'Abdullah Khan',
    username: '@abdullahk',
    body: 'MENACE ka quality dekh kar yakeen nahi hua. International brand jaisa feel hai.',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    country: '🇵🇰 Karachi',
  },
  {
    name: 'Fatima Ahmed',
    username: '@fatimaa',
    body: 'Oversized fit bilkul waise jaise main chahti thi. Highly recommended!',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    country: '🇵🇰 Lahore',
  },
  {
    name: 'Hassan Ali',
    username: '@hassanali',
    body: 'Fabric ka weight and stitching — top notch. Bohot hard drop hai ye.',
    img: 'https://randomuser.me/api/portraits/men/46.jpg',
    country: '🇵🇰 Islamabad',
  },
  {
    name: 'Zainab Sheikh',
    username: '@zsheikh',
    body: 'Delivery bohat fast thi aur packaging ekdum premium. Love it.',
    img: 'https://randomuser.me/api/portraits/women/26.jpg',
    country: '🇵🇰 Lahore',
  },
  {
    name: 'Rayan Iqbal',
    username: '@rayaniqbal',
    body: 'Pehna hai to log puchte hain kahan milta hai. MENACE is the real deal.',
    img: 'https://randomuser.me/api/portraits/men/75.jpg',
    country: '🇵🇰 Karachi',
  },
  {
    name: 'Ayesha Tariq',
    username: '@ayeshat',
    body: 'Black-on-black details next level hain. Craftsmanship speaks for itself.',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
    country: '🇵🇰 Islamabad',
  },
  {
    name: 'Usman Chaudhry',
    username: '@uchaudhry',
    body: 'Ghar se nikalte hi log nazarein utha lete hain. Streetwear done right.',
    img: 'https://randomuser.me/api/portraits/men/54.jpg',
    country: '🇵🇰 Lahore',
  },
  {
    name: 'Sara Farooqi',
    username: '@sfarooqi',
    body: 'Fit bilkul perfect hai. Jaise mere liye bana ho. Worth every rupee.',
    img: 'https://randomuser.me/api/portraits/women/31.jpg',
    country: '🇵🇰 Karachi',
  },
  {
    name: 'Bilal Akhtar',
    username: '@bilalakhtar',
    body: 'Premium feel, bold designs. Yeh woh brand hai jo Pakistan ko chahiye tha.',
    img: 'https://randomuser.me/api/portraits/men/29.jpg',
    country: '🇵🇰 Islamabad',
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-56 border-white/10 bg-ink-soft">
      <CardContent className="p-4">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9 ring-1 ring-white/10">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs">{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-zinc-100 flex items-center gap-1">
              {name} <span className="text-xs">{country}</span>
            </figcaption>
            <p className="text-xs font-medium text-zinc-500">{username}</p>
          </div>
        </div>
        <blockquote className="mt-3 text-sm text-zinc-300 leading-relaxed">{body}</blockquote>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative bg-ink py-20 sm:py-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="flex items-center space-x-4 mb-3 sm:mb-4">
          <span className="text-[10px] uppercase tracking-widest text-accent">The Verdict</span>
          <div className="h-px w-12 bg-white/10" />
        </div>
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-[family-name:var(--font-heading)] uppercase tracking-tight leading-none text-white">
          What the <span className="font-display italic font-normal lowercase tracking-normal text-accent">crowd</span> says
        </h2>
      </div>

      <div className="border-y border-white/10 relative flex h-80 sm:h-96 w-full flex-row items-center justify-center overflow-hidden [perspective:300px]">
        <div
          className="flex flex-row items-center gap-4"
          style={{
            transform:
              'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)',
          }}
        >
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover repeat={3} className="[--duration:40s]">
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>
          <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
            {testimonials.map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-ink" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-ink" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-ink" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-ink" />
        </div>
      </div>
    </section>
  );
}
