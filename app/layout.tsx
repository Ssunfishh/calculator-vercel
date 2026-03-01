import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scientific Calculator',
  description: 'Enhanced scientific calculator with Next.js on Vercel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
