'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface StructuredDataProps {
  type: 'website' | 'organization' | 'product' | 'service'
  data?: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const { language } = useLanguage()

  useEffect(() => {
    let structuredData: any = {}

    switch (type) {
      case 'website':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Remover Fundo",
          "url": "https://removerfundo.com",
          "description": language === 'zh' 
            ? "Remover Fundo是专业的AI图像处理平台，为您提供精准的背景移除、物体分割和图像增强服务。"
            : "Remover Fundo is a professional AI image processing platform, providing you with precise background removal, object segmentation, and image enhancement services.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://removerfundo.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
        break

      case 'organization':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Remover Fundo",
          "url": "https://removerfundo.com",
          "logo": "https://removerfundo.com/images/logo.png",
          "description": language === 'zh'
            ? "Remover Fundo是专业的AI图像处理平台，致力于通过先进的AI技术，为用户提供专业、高效、易用的图像处理解决方案。"
            : "Remover Fundo is a professional AI image processing platform, committed to providing professional, efficient, and user-friendly image processing solutions through advanced AI technology.",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "q9425916@gmail.com"
          },
          "sameAs": [
            "https://twitter.com/removerfundo",
            "https://facebook.com/removerfundo"
          ]
        }
        break

      case 'product':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Remover Fundo",
          "applicationCategory": "ImageProcessingApplication",
          "operatingSystem": "Web Browser",
          "url": "https://removerfundo.com",
          "description": language === 'zh'
            ? "Remover Fundo是专业的AI图像处理平台，提供背景移除、物体分割和图像增强服务。"
            : "Remover Fundo is a professional AI image processing platform, providing background removal, object segmentation, and image enhancement services.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "10000"
          }
        }
        break

      case 'service':
        structuredData = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Remover Fundo AI Image Processing",
          "description": language === 'zh'
            ? "Remover Fundo提供专业的AI图像处理服务，包括背景移除、物体分割和图像增强。"
            : "Remover Fundo provides professional AI image processing services including background removal, object segmentation, and image enhancement.",
          "provider": {
            "@type": "Organization",
            "name": "Remover Fundo"
          },
          "areaServed": "Worldwide",
          "serviceType": "AI Image Processing"
        }
        break
    }

    // 添加自定义数据
    if (data) {
      structuredData = { ...structuredData, ...data }
    }

    // 移除现有的结构化数据脚本
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }

    // 添加新的结构化数据脚本
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [type, data, language])

  return null
} 