import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'
import DynamicHead from '@/components/dynamic-head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Remover Fundo - AI Image Processing Platform',
  description: 'Remover Fundo professional AI image processing platform, providing precise background removal, object segmentation, and image enhancement services.',
  keywords: 'Remover Fundo, AI image processing, background removal, image enhancement, object segmentation, professional image editing, AI tools, image processing platform',
  authors: [{ name: 'Remover Fundo Team' }],
  creator: 'Remover Fundo',
  publisher: 'Remover Fundo',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://removerfundo.com',
    title: 'Remover Fundo - AI Image Processing Platform',
    description: 'Remover Fundo professional AI image processing platform, providing precise background removal, object segmentation, and image enhancement services.',
    siteName: 'Remover Fundo',
    images: [
      {
        url: '/images/og-comparison.png',
        width: 1200,
        height: 630,
        alt: 'Remover Fundo - Before and After AI Image Processing Comparison',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remover Fundo - AI Image Processing Platform',
    description: 'Remover Fundo professional AI image processing platform, providing precise background removal, object segmentation, and image enhancement services.',
    images: ['/images/og-comparison.png'],
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  verification: {
    google: 'pZ60H5LQnT63mobooCaSeL42w2efOEwRDDWmevPzA6k',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldUseDark = theme === 'dark' || (!theme && prefersDark);
                  
                  if (shouldUseDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // 如果localStorage不可用，默认使用浅色主题
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-D9VQ7NNWPF"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D9VQ7NNWPF');
            `,
          }}
        />
        
        {/* Microsoft Clarity */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "soh506mjkt");
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <DynamicHead />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
} 