'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface TransparentLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function TransparentLogo({ size = 'md', showText = true, className = '' }: TransparentLogoProps) {
  const { t } = useLanguage()
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {!imageError ? (
        <img
          src="/images/logo.png"
          alt={t('logo.alt')}
          className={`${sizeClasses[size]} object-contain`}
          style={{ 
            backgroundColor: 'transparent',
            mixBlendMode: 'normal'
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">抠</span>
        </div>
      )}
      
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse ${textSizes[size]}`}>
          {t('logo.text')}
        </span>
      )}
    </div>
  )
} 