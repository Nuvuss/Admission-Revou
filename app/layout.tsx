import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="id">
      <head>
        <link rel="icon" href="/revou-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/revou-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@500;700;800;900&family=Red+Hat+Mono:wght@400;500;600&family=Red+Hat+Text:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
