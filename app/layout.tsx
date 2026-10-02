import type { Metadata, Viewport } from 'next';
import { Fraunces, DM_Sans } from 'next/font/google';
import './globals.css';
import { ScanProvider } from '../lib/store';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700', '900'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'RealCheck',
  description:
    'Check a product label for counterfeit red flags before you buy.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RealCheck',
  },
};

export const viewport: Viewport = {
  themeColor: '#87A878',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-[#F5F2EC] text-[#1A1F1A] antialiased font-body">
        <ScanProvider>{children}</ScanProvider>
      </body>
    </html>
  );
}