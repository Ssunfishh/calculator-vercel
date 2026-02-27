import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculator',
  description: 'A minimal Next.js calculator app ready for Vercel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
