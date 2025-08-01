'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en') // 默认英语

  useEffect(() => {
    // 从localStorage获取保存的语言设置
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    } else {
      // 如果没有保存的语言设置，默认使用英语
      setLanguage('en')
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  // 翻译函数
  const t = (key: string): any => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }
    
    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 