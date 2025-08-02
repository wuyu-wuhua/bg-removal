'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  pageType?: 'home' | 'about' | 'pricing' | 'cases' | 'upload' | 'help' | 'service' | 'privacy' | 'terms' | 'refund'
}

export default function SEOHead({ 
  title, 
  description, 
  keywords, 
  pageType = 'home' 
}: SEOHeadProps) {
  const { t, language } = useLanguage()

  useEffect(() => {
    // 动态设置页面标题
    const pageTitle = title || t('metadata.pageTitle')
    document.title = pageTitle
    
    // 动态设置html的lang属性
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    
    // 动态设置meta描述
    const metaDescription = description || t('metadata.description')
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', metaDescription)
    
    // 动态设置关键词
    const metaKeywords = keywords || 'Remover Fundo, AI image processing, background removal, image enhancement, object segmentation, professional image editing, AI tools, image processing platform'
    let metaKeywordsElement = document.querySelector('meta[name="keywords"]')
    if (!metaKeywordsElement) {
      metaKeywordsElement = document.createElement('meta')
      metaKeywordsElement.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywordsElement)
    }
    metaKeywordsElement.setAttribute('content', metaKeywords)
    
    // 设置Open Graph标签
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', pageTitle)
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]')
    if (ogDescription) {
      ogDescription.setAttribute('content', metaDescription)
    }
    
    // 设置Twitter Card标签
    const twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (twitterTitle) {
      twitterTitle.setAttribute('content', pageTitle)
    }
    
    const twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (twitterDescription) {
      twitterDescription.setAttribute('content', metaDescription)
    }
    
  }, [t, language, title, description, keywords, pageType])

  return null
} 