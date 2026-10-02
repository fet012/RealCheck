'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScan } from '../../lib/store';
import { extractText, preprocessText } from '../../lib/ocr';
import { runAllRules } from '../../lib/rules';
import { summarize } from '../../lib/scoring';
import { Logo, Wordmark } from '../../components/Logo';
import type { Category } from '../../adapters/nafdacAdapter';

const categories: { id: Category; label: string; hint: string }[] = [
  { id: 'medicines', label: 'Drugs', hint: 'Tablets, syrups, injections' },
  { id: 'packaged_food', label: 'Cooking Oil', hint: 'Palm, vegetable, groundnut' },
  { id: 'cosmetics', label: 'Cosmetics', hint: 'Creams, soaps, lotions' },
];

export default function ScanPage() {
  const router = useRouter();
  const {
    category,
    setCategory,
    setImageDataUrl,
    setOcrText,
    setReport,
  } = useScan();
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'ocr' | 'rules' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setStatus('ocr');
    const ocr = await extractText(file);

    if (ocr.error) {
      setError("Couldn't read the label clearly. Try better lighting or a flatter angle.");
      setStatus('error');
      return;
    }

    const cleaned = preprocessText(ocr.text);
    if (!cleaned.trim()) {
      setError("Couldn't read the label clearly. Try better lighting or a flatter angle.");
      setStatus('error');
      return;
    }

    setOcrText(cleaned);

    setStatus('rules');
    const results = runAllRules(cleaned, category);
    const report = summarize(results);
    setReport(report);

    router.push('/result');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    setPreview(null);
    setStatus('idle');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <main className="min-h-screen bg-warm-white text-deep-forest max-w-md mx-auto flex flex-col">
      <nav className="flex items-center justify-between p-5 border-b border-deep-forest/10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </Link>
      </nav>

      {/* Section A — Category selector */}
      <section className="px-5 pt-8 pb-6">
        <h1 className="font-medium text-lg mb-4">What are you checking?</h1>
        <div className="flex flex-col gap-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`text-left p-4 rounded-lg border-2 transition ${
                category === c.id
                  ? 'border-sage bg-pale-sage/40'
                  : 'border-deep-forest/10 bg-warm-white hover:border-sage/40'
              }`}
            >
              <div className="font-medium">{c.label}</div>
              <div className="text-xs text-deep-forest/60 mt-0.5">{c.hint}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Section B — Scan / upload */}
      <section className="px-5 pb-8 flex-1">
        {preview ? (
          <div className="flex flex-col gap-4">
            <div className="relative rounded-lg overflow-hidden border border-deep-forest/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Label preview" className="w-full block" />
              {(status === 'ocr' || status === 'rules') && (
                <div className="absolute inset-0 bg-sage/10">
                  <div className="scan-line absolute inset-x-0 h-0.5 bg-sage" />
                </div>
              )}
            </div>

            {status === 'ocr' && (
              <p className="text-center text-sm text-deep-forest/60">
                Reading label...
              </p>
            )}
            {status === 'rules' && (
              <p className="text-center text-sm text-deep-forest/60">
                Checking red flags...
              </p>
            )}
            {status === 'error' && (
              <>
                <p className="text-center text-sm text-alert-red">{error}</p>
                <button
                  onClick={handleReset}
                  className="w-full border border-deep-forest/20 py-3 rounded-lg hover:bg-pale-sage/40 transition"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        ) : (
          <label className="cursor-pointer block">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleChange}
              className="hidden"
            />
            <div className="border-2 border-dashed border-deep-forest/20 rounded-lg p-12 text-center hover:border-sage transition">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-sage flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#87A878" strokeWidth="2">
                  <rect x="3" y="6" width="18" height="14" rx="2" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <div className="font-medium">Take a photo</div>
              <div className="text-xs text-deep-forest/50 mt-1">
                Or choose from gallery
              </div>
            </div>
          </label>
        )}
      </section>
    </main>
  );
}