import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Pulkit Singh — Portfolio',
  description: 'Full Stack Developer & ML Engineer. B.Tech CSE @ VIT Chennai.',
  keywords: ['Pulkit Singh', 'Portfolio', 'Full Stack', 'Next.js', 'Machine Learning', 'VIT Chennai'],
  authors: [{ name: 'Pulkit Singh' }],
  openGraph: {
    title: 'Pulkit Singh — Portfolio',
    description: 'Full Stack Developer & ML Engineer. B.Tech CSE @ VIT Chennai.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
