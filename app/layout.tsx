import type { Metadata } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });
const editorial = Instrument_Serif({ variable: '--font-editorial', subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: 'Andy Kumeda — Runner, Builder, Infrastructure Engineer',
  description: 'The personal website of Andy Kumeda: endurance running, independent software, infrastructure automation, photography, and music.',
  metadataBase: new URL('https://andykumeda.com'),
  openGraph: {
    title: 'Andy Kumeda — Runner, Builder, Infrastructure Engineer',
    description: 'Endurance running, independent software, infrastructure automation, photography, and music.',
    url: 'https://andykumeda.com',
    siteName: 'Andy Kumeda',
    type: 'website',
    images: [{ url: '/og.png', width: 1731, height: 909, alt: 'Andy Kumeda — Runner, Builder, Infrastructure Engineer' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andy Kumeda — Runner, Builder, Infrastructure Engineer',
    description: 'Endurance running, independent software, infrastructure automation, photography, and music.',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geist.variable} ${mono.variable} ${editorial.variable}`}>{children}</body></html>;
}
