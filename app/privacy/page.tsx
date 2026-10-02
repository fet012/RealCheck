import Link from 'next/link';
import { Logo, Wordmark } from '../../components/Logo';

export default function Privacy() {
  return (
    <main className="min-h-screen bg-warm-white text-deep-forest max-w-md mx-auto flex flex-col">
      <nav className="flex items-center justify-between p-5 border-b border-deep-forest/10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </Link>
      </nav>

      <section className="px-5 py-8">
        <h1 className="font-display text-2xl font-bold mb-4">Privacy Policy</h1>

        <div className="space-y-4 text-sm text-deep-forest/80 leading-relaxed">
          <p>
            RealCheck does not require an account. We do not collect names,
            emails, or phone numbers.
          </p>

          <p>
            <strong>Images you scan are processed on your device.</strong> The
            OCR runs entirely in your browser using Tesseract.js. No image is
            uploaded to any server.
          </p>

          <p>
            The text extracted from your label stays in your browser. We do not
            store it, transmit it, or share it.
          </p>

          <p>
            If you install RealCheck as an app, your browser may cache the
            pages you visit so the app works offline. You can clear this cache
            at any time in your browser settings.
          </p>
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