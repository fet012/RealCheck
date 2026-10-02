import Link from 'next/link';
import { Logo, Wordmark } from '../../components/Logo';

export default function Terms() {
  return (
    <main className="min-h-screen bg-warm-white text-deep-forest max-w-md mx-auto flex flex-col">
      <nav className="flex items-center justify-between p-5 border-b border-deep-forest/10">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <Wordmark className="text-lg" />
        </Link>
      </nav>

      <section className="px-5 py-8">
        <h1 className="font-display text-2xl font-bold mb-4">Terms of Use</h1>

        <div className="space-y-4 text-sm text-deep-forest/80 leading-relaxed">
          <p>
            RealCheck is a free tool that checks product labels against a
            snapshot of NAFDAC registration data. It is provided as-is, with no
            warranty of accuracy or completeness.
          </p>

          <p>
            <strong>RealCheck is not a certificate of authenticity.</strong> It
            does not confirm that any product is genuine. It reports what it
            checked, what it found, and what it could not verify. A counterfeit
            can copy every detail on a label.
          </p>

          <p>
            RealCheck is not affiliated with NAFDAC, the FCCPC, or any
            manufacturer. It does not replace a lab test, a NAFDAC field
            inspection, or professional medical advice.
          </p>

          <p>
            Do not rely on RealCheck as your only source of information before
            consuming any product. If you suspect a product is counterfeit,
            report it to NAFDAC directly.
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