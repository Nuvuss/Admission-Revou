import type { Metadata } from 'next';
import { Red_Hat_Display, Red_Hat_Text, Red_Hat_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import MotionProvider from './components/MotionProvider';
import './globals.css';

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const redHatText = Red_Hat_Text({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
});

const redHatMono = Red_Hat_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admission Assistant · RevoU AI Sales Copilot',
  description: 'Turn prospect context into a better pitch. Grounded on RevoU Knowledge Base.',
  icons: {
    icon: [
      { url: '/revou-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/revou-logo.png',
    apple: '/revou-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${redHatDisplay.variable} ${redHatText.variable} ${redHatMono.variable}`}
    >
      <head>
        <link rel="icon" href="/revou-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/revou-logo.png" />
      </head>
      <body className="antialiased min-h-screen">
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
