'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/language-context'

interface WipeAnimationProps {
  originalImage: string
  processedImage: string
  isActive: boolean
  onComplete?: () => void
  duration?: number
  className?: string
}

export function WipeAnimation({
  originalImage,
  processedImage,
  isActive,
  onComplete,
  duration = 1500,
  className
}: WipeAnimationProps) {
  const { t } = useLanguage()
  const [progress, setProgress] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isActive) {
      setProgress(0)
      return
    }

    // 确保图片已加载后再开始动画
    if (!imagesLoaded) {
      return
    }

    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min(elapsed / duration, 1)

      setProgress(newProgress)

      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    // 立即开始动画
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, duration, onComplete, imagesLoaded])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* 原图（底层） */}
      <img
        src={originalImage}
        alt={t('upload.editor.originalImageAlt')}
        className="w-full h-full object-contain"
        onLoad={() => {
          // 当原图加载完成时，检查处理后图片是否也加载完成
          const processedImg = new Image()
          processedImg.onload = () => setImagesLoaded(true)
          processedImg.src = processedImage
        }}
      />

      {/* 处理后图片（顶层，带擦除效果） */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
          transition: 'clip-path 0.05s ease-out'
        }}
      >
        <img
          src={processedImage}
          alt={t('upload.editor.processedImageAlt')}
          className="w-full h-full object-contain"
        />
      </div>

      {/* 擦除线 */}
      {isActive && progress < 1 && (
        <div
          className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 shadow-xl"
          style={{
            left: `${progress * 100}%`,
            transform: 'translateX(-50%)',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
        />
      )}
    </div>
  )
} 