import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { DM_Sans, Manrope, Noto_Sans } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import './globals.css';
import Header from '@/components/Header/Header';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--next-font-manrope',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--next-font-dm-sans',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--next-font-noto-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Harmoniq',
    template: '%s | Harmoniq',
  },
  description: 'Find your harmony in community.',
  openGraph: {
    title: 'Harmoniq',
    description: 'Find your harmony in community.',
    url: 'https://harmoniq.com',
    siteName: 'Harmoniq',
    locale: 'uk_UA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="uk" className={`${manrope.variable} ${dmSans.variable} ${notoSans.variable}`}>
      <body>
        <AppProviders><Header/>{children}</AppProviders>
      </body>
    </html>
  );
}
