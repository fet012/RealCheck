import Link from 'next/link';
import { Logo, Wordmark } from '../../components/Logo';

const steps = [
  {
    n: '1',
    title: 'Choose your category',
    body: 'Tell us what you are checking — a drug, cooking oil, or cosmetic product.',
  },
  {
    n: '2',
    title: 'Photograph the label',
    body: 'Point your camera at the product label or upload a photo. RealCheck reads the text — the NAFDAC number, manufacturer name, product name.',
  },
  {
    n: '3',
    title: 'Read your report',
    body: 'We check what we can. We tell you what passed, what was flagged, and what we could not verify. No false confidence.',
  },
];

const canDo = [
  'Checks NAFDAC number format and registration status',
  'Flags missing addresses, suspicious label patterns, restricted ingredients',
];

const cannotDo = [
  'Cannot confirm the specific unit in your hand is genuine',
  'Cannot replace a lab test or NAFDAC field inspection',
  'Does not cover every product category yet',
];

export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-warm-white text-deep-forest max-w-md mx-auto flex flex-col">
      <nav className="flex items-center justify-between p-5 border-b border-deep-forest/10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </Link>
        <Link href="/scan" className="text-sm text-sage font-medium">
          Scan Now
        </Link>
      </nav>

      <section className="px-5 pt-8 pb-6">
        <h1 className="font-display text-3xl font-bold mb-3">
          How RealCheck works
        </h1>
        <p className="text-deep-forest/70">
          Three steps. No account. No guessing.
        </p>
      </section>

      <section className="px-5 pb-8">
        {steps.map((s) => (
          <div key={s.n} className="mb-6 flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage text-warm-white flex items-center justify-center font-medium text-sm">
              {s.n}
            </div>
            <div>
              <h2 className="font-medium mb-1">{s.title}</h2>
              <p className="text-sm text-deep-forest/70 leading-relaxed">
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-5 pb-8">
        <h2 className="font-display text-xl font-bold mb-4">
          What RealCheck can and cannot do
        </h2>

        <div className="mb-4">
          <p className="text-xs uppercase tracking-wider text-sage font-medium mb-2">
            Can
          </p>
          <ul className="space-y-2">
            {canDo.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <span className="text-sage flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-alert-red font-medium mb-2">
            Cannot
          </p>
          <ul className="space-y-2">
            {cannotDo.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <span className="text-alert-red flex-shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-deep-forest/10 px-5 py-4 flex gap-4 text-xs text-deep-forest/50 mt-auto">
        <Link href="/terms" className="hover:text-deep-forest">Terms</Link>
        <Link href="/privacy" className="hover:text-deep-forest">Privacy</Link>
        <span className="ml-auto">Built for Nigeria</span>
      </footer>
    </main>
  );
}