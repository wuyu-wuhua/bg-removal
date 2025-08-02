import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/language-context'
import { AuthProvider } from '@/contexts/auth-context'
import DynamicHead from '@/components/dynamic-head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Remover Fundo - Professional AI Image Processing Platform',
  description: 'Professional AI image processing platform, providing you with precise background removal, object segmentation, and image enhancement services.',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
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