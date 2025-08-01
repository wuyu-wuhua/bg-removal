'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

export default function DynamicHead() {
  const { t, language } = useLanguage()

  useEffect(() => {
    // 动态设置页面标题
    document.title = t('metadata.pageTitle')
    
    // 动态设置html的lang属性
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
  }, [t, language])

  return null
}