'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScan } from '../../lib/store';
import { Logo, Wordmark } from '../../components/Logo';
import type { RuleResult } from '../../lib/rules';

const levelStyles = {
  SERIOUS: {
    bg: 'bg-alert-red/15',
    border: 'border-alert-red',
    text: 'text-alert-red',
    icon: '❌',
    label: 'Serious concerns — proceed carefully',
  },
  MINOR: {
    bg: 'bg-amber/15',
    border: 'border-amber',
    text: 'text-amber',
    icon: '⚠️',
    label: 'Minor concerns detected',
  },
  NONE: {
    bg: 'bg-pale-sage',
    border: 'border-sage',
    text: 'text-sage',
    icon: '✓',
    label: 'No red flags found',
  },
} as const;

const groups = [
  { key: 'registration', title: 'Registration checks', ids: ['nafdac_present', 'nafdac_format', 'nafdac_exists', 'category_prefix'] },
  { key: 'label', title: 'Label quality checks', ids: ['physical_address', 'expiry_present', 'batch_present', 'produced_for', 'english_present'] },
];

function RuleRow({ rule }: { rule: RuleResult }) {
  const icons: Record<string, string> = { fail: '✗', warn: '⚠', pass: '✓', skip: '—' };
  const colors: Record<string, string> = {
    fail: 'text-alert-red',
    warn: 'text-amber',
    pass: 'text-sage',
    skip: 'text-deep-forest/40',
  };

  return (
    <div className="flex gap-3 py-3 border-b border-deep-forest/10 last:border-0">
      <span className={`text-sm flex-shrink-0 w-4 ${colors[rule.status]}`}>
        {icons[rule.status]}
      </span>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider text-deep-forest/60">
          {rule.name}
        </div>
        <div className={`text-sm mt-0.5 ${colors[rule.status]}`}>
          {rule.message}
        </div>
        {rule.evidence && (
          <div className="text-xs text-deep-forest/40 mt-1 font-mono">
            {rule.evidence}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { report, imageDataUrl, category, reset } = useScan();

  if (!report) {
    return (
      <main className="min-h-screen bg-warm-white text-deep-forest flex flex-col items-center justify-center p-6">
        <p className="text-deep-forest/60 mb-4">No scan yet.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-sage text-warm-white font-medium px-6 py-3 rounded-lg"
        >
          Start Over
        </button>
      </main>
    );
  }

  const style = levelStyles[report.level];
  const categoryLabel = category === 'medicines' ? 'Drugs' : category === 'cosmetics' ? 'Cosmetics' : 'Cooking Oil';

  // Pull NAFDAC number from rules
  const nafdacRule = report.all.find((r) => r.id === 'nafdac_present');
  const nafdacNumber = nafdacRule?.evidence || 'Not found';

  const handleScanAnother = () => {
    reset();
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-warm-white text-deep-forest max-w-md mx-auto flex flex-col">
      <nav className="flex items-center justify-between p-5 border-b border-deep-forest/10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </Link>
      </nav>

      <section className="px-5 pt-6 pb-4">
        {/* Verdict card */}
        <div className={`border-2 ${style.border} ${style.bg} rounded-lg p-5 mb-4`}>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{style.icon}</span>
            <div className="flex-1">
              <p className={`font-display text-lg font-bold ${style.text}`}>
                {style.label}
              </p>
            </div>
          </div>

          <div className="border-t border-deep-forest/10 pt-3 space-y-1 text-xs text-deep-forest/70">
            <div className="flex justify-between">
              <span>NAFDAC number</span>
              <span className="font-mono">{nafdacNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Category</span>
              <span>{categoryLabel}</span>
            </div>
            <div className="flex justify-between">
              <span>Checked</span>
              <span>{new Date().toLocaleString('en-NG', { dateStyle: 'short', timeStyle: 'short' })}</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-pale-sage/40 rounded-lg p-3 mb-6">
          <p className="text-xs text-deep-forest/70 leading-relaxed">
            This is not a certificate of authenticity. A counterfeit can copy
            every detail on a label.
          </p>
        </div>

        {/* Rules grouped */}
        {groups.map((group) => {
          const rules = report.all.filter((r) => group.ids.includes(r.id));
          if (rules.length === 0) return null;

          return (
            <div key={group.key} className="mb-6">
              <h2 className="text-xs uppercase tracking-wider text-deep-forest/50 mb-2">
                {group.title}
              </h2>
              <div className="bg-warm-white border border-deep-forest/10 rounded-lg px-4">
                {rules.map((r) => (
                  <RuleRow key={r.id} rule={r} />
                ))}
              </div>
            </div>
          );
        })}

        {imageDataUrl && (
          <div className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUrl}
              alt="Scanned label"
              className="w-full rounded-lg border border-deep-forest/10"
            />
          </div>
        )}
      </section>

      <footer className="p-5 mt-auto space-y-3">
        <button
          onClick={handleScanAnother}
          className="w-full bg-sage hover:bg-sage/90 text-warm-white font-medium py-4 rounded-lg transition"
        >
          Scan another product
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'RealCheck result',
                text: `${style.label} — NAFDAC ${nafdacNumber}`,
              });
            }
          }}
          className="w-full border border-deep-forest/20 hover:bg-pale-sage/40 py-4 rounded-lg transition text-sm"
        >
          Share this result
        </button>
      </footer>
    </main>
  );
}