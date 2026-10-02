'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo, Wordmark } from '../components/Logo';
import { useScan } from '../lib/store';
import type { Category } from '../adapters/nafdacAdapter';

const categories: { id: Category; label: string; hint: string; icon: string }[] = [
  { id: 'medicines', label: 'Drugs', hint: 'Tablets, syrups, injections', icon: '💊' },
  { id: 'packaged_food', label: 'Cooking Oil', hint: 'Palm, vegetable, groundnut', icon: '🫙' },
  { id: 'cosmetics', label: 'Cosmetics', hint: 'Creams, soaps, lotions', icon: '🧴' },
];

export default function Home() {
  const router = useRouter();
  const { setCategory } = useScan();

  const handleCategory = (id: Category) => {
    setCategory(id);
    router.push('/scan');
  };

  return (
    <main className="min-h-screen bg-warm-white text-deep-forest max-w-md mx-auto flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between p-5 border-b border-deep-forest/10">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </div>
        <Link
          href="/how-it-works"
          className="text-sm text-deep-forest/70 hover:text-deep-forest"
        >
          How it Works
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-5 pt-10 pb-8">
        <h1 className="font-display text-4xl font-bold leading-tight mb-4">
          Check it before it harms you.
        </h1>
        <p className="text-base text-deep-forest/70 leading-relaxed mb-6">
          Fake products are everywhere in Nigerian markets. RealCheck scans
          product labels and flags red flags — instantly, honestly, for free.
        </p>
        <button
          onClick={() => router.push('/scan')}
          className="w-full bg-sage hover:bg-sage/90 text-warm-white font-medium py-4 rounded-lg transition"
        >
          Scan a product
        </button>
        <p className="text-xs text-deep-forest/50 text-center mt-3">
          No login. No account. Just scan.
        </p>
      </section>

      {/* Category chips */}
      <section className="px-5 pb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategory(c.id)}
              className="px-3 py-2 rounded-full border border-deep-forest/15 bg-pale-sage/40 hover:bg-pale-sage text-sm transition"
            >
              <span className="mr-1.5">{c.icon}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Example result preview */}
      <section className="px-5 pb-8">
        <p className="text-xs uppercase tracking-wider text-deep-forest/50 mb-3">
          Example result
        </p>
        <div className="rounded-lg border border-alert-red/30 bg-alert-red/10 p-4">
          <div className="flex items-start gap-3">
            <span className="text-lg">❌</span>
            <div>
              <p className="font-medium text-alert-red">
                Serious concerns — proceed carefully
              </p>
              <p className="text-xs text-deep-forest/60 mt-1">
                NAFDAC number not found in database
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust line */}
      <section className="px-5 pb-8 mt-auto">
        <p className="text-xs text-deep-forest/50 leading-relaxed">
          Powered by NAFDAC registration data. We never say genuine. We show
          you what we checked.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-deep-forest/10 px-5 py-4 flex gap-4 text-xs text-deep-forest/50">
        <Link href="/terms" className="hover:text-deep-forest">Terms</Link>
        <Link href="/privacy" className="hover:text-deep-forest">Privacy</Link>
        <span className="ml-auto">Built for Nigeria</span>
      </footer>
    </main>
  );
}