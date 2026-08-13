import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pulkit-portfolio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Pulkit Singhroha | Full Stack Engineer & ML Researcher',
    template: '%s | Pulkit Singhroha',
  },
  description: 'B.Tech CSE @ VIT Chennai (CGPA 9.02). Full Stack Engineer, Graph Neural Networks Researcher, Web Dev Lead @ NSCC VIT, 2x International Hackathon Finalist.',
  keywords: [
    'Pulkit Singhroha',
    'Pulkit',
    'Full Stack Developer',
    'Software Development Engineer',
    'SDE Fresher',
    'VIT Chennai',
    'Machine Learning Engineer',
    'Graph Neural Networks',
    'Next.js Developer',
    'MERN Stack',
    'LeetCode',
  ],
  authors: [{ name: 'Pulkit Singhroha', url: 'https://github.com/pulkit31s' }],
  creator: 'Pulkit Singhroha',
  openGraph: {
    title: 'Pulkit Singhroha — Software Development Engineer & ML Researcher',
    description: 'B.Tech CSE @ VIT Chennai · CGPA 9.02 · 2x International Hackathon Finalist · Building full-stack & AI systems.',
    url: baseUrl,
    siteName: 'Pulkit Singhroha Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${baseUrl}/og-banner.png`,
        width: 1200,
        height: 630,
        alt: 'Pulkit Singhroha - Software Development Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulkit Singhroha | Software Engineer & ML Researcher',
    description: 'B.Tech CSE @ VIT Chennai · CGPA 9.02 · Full Stack & AI Developer.',
    images: [`${baseUrl}/og-banner.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pulkit Singhroha',
  alternateName: 'Pulkit',
  url: baseUrl,
  jobTitle: 'Software Development Engineer & Machine Learning Researcher',
  worksFor: {
    '@type': 'Organization',
    name: 'Newton School Coding Club (NSCC), VIT Chennai',
  },
  almaMater: {
    '@type': 'EducationalOrganization',
    name: 'Vellore Institute of Technology, Chennai',
  },
  sameAs: [
    'https://github.com/pulkit31s',
    'https://leetcode.com/pulkit31s',
    'https://linkedin.com',
  ],
  knowsAbout: [
    'Full Stack Web Development',
    'Next.js',
    'React.js',
    'Node.js',
    'Graph Neural Networks',
    'PyTorch',
    'MongoDB',
    'Microsoft Azure',
    'Cloud Computing',
    'Data Structures & Algorithms',
  ],
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#050508] text-white selection:bg-[#00d4ff]/30 selection:text-[#00d4ff]">
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
