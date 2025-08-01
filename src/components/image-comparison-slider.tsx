'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface ImageComparisonSliderProps {
  originalImage: string
  processedImage: string
  showPercentage?: boolean
  transparentBackground?: 'checkerboard' | 'white' | 'black' | 'none'
}

export function ImageComparisonSlider({ 
  originalImage, 
  processedImage, 
  showPercentage = false,
  transparentBackground = 'checkerboard'
}: ImageComparisonSliderProps) {
  const { t } = useLanguage()
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // 直接更新滑块位置，避免状态更新延迟
  const updateSliderPosition = useCallback((percentage: number) => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage))
    setSliderPosition(clampedPercentage)
    
    // 直接更新滑块元素位置，确保同步
    if (sliderRef.current) {
      sliderRef.current.style.left = `${clampedPercentage}%`
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    updateSliderPosition(percentage)
  }, [updateSliderPosition])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove])

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleReactTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return
    
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const percentage = (x / rect.width) * 100
    updateSliderPosition(percentage)
  }

  const handleReactTouchEnd = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // 获取透明背景样式
  const getTransparentBackgroundStyle = () => {
    switch (transparentBackground) {
      case 'checkerboard':
        return {
          backgroundImage: 'linear-gradient(45deg, rgb(200, 200, 200) 25%, transparent 25%), linear-gradient(-45deg, rgb(200, 200, 200) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgb(200, 200, 200) 75%), linear-gradient(-45deg, transparent 75%, rgb(200, 200, 200) 75%)',
          backgroundPosition: '0px 0px, 0px 10px, 10px -10px, -10px 0px',
          backgroundSize: '20px 20px'
        }
      case 'white':
        return { backgroundColor: 'white' }
      case 'black':
        return { backgroundColor: 'black' }
      case 'none':
      default:
        return { backgroundColor: 'transparent' }
    }
  }

  return (
    <div className="relative border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-300 shadow-xl hover:shadow-2xl group">
      <div className="absolute top-4 left-4 translate-y-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 z-10">
        <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">{t('imageComparison.dragToCompare')}</span>
      </div>
      {showPercentage && (
        <div className="absolute top-4 right-4 transition-all duration-300 opacity-0 group-hover:opacity-100 z-10">
          <span className="bg-blue-500/90 text-white text-xs px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
            {Math.round(sliderPosition)}%
          </span>
        </div>
      )}
      
      <div 
        className="relative aspect-video cursor-ew-resize rounded-lg" 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleReactTouchMove}
        onTouchEnd={handleReactTouchEnd}
      >
        {/* 原图 - 使用clipPath裁剪右侧区域 */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ 
            clipPath: `inset(0px ${100 - sliderPosition}% 0px 0px)`
          }}
        >
          <img 
            alt={t('imageComparison.originalImage')} 
            loading="lazy" 
            decoding="async" 
            className="object-cover w-full h-full" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={originalImage}
            onLoad={() => console.log('原图加载成功:', originalImage)}
            onError={(e) => console.error('原图加载失败:', originalImage, e)}
          />
        </div>
        
        {/* 结果图 - 使用clipPath裁剪左侧区域 */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ 
            clipPath: `inset(0px 0px 0px ${sliderPosition}%)`
          }}
        >
          {/* 透明背景层 - 放在结果图底下 */}
          {transparentBackground === 'checkerboard' && (
            <div 
              className="absolute inset-0" 
              style={getTransparentBackgroundStyle()}
            />
          )}
          {transparentBackground === 'white' && (
            <div className="absolute inset-0 bg-white" />
          )}
          {transparentBackground === 'black' && (
            <div className="absolute inset-0 bg-black" />
          )}
          
          {/* 结果图片 - 放在背景层上面 */}
          <img 
            alt={t('imageComparison.resultImage')} 
            loading="lazy" 
            decoding="async" 
            className="object-cover w-full h-full relative z-10" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={processedImage}
            onLoad={(e) => {
              console.log('结果图片加载成功:', processedImage)
              console.log('图片元素:', e.target)
            }}
            onError={(e) => {
              console.error('结果图片加载失败:', processedImage, e)
              console.error('错误详情:', e.target)
            }}
          />
        </div>
        
        {/* 标签 */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center justify-center border border-transparent font-medium rounded-md px-2 h-6 min-w-6 text-xs bg-gray-500/90 text-white shadow-lg backdrop-blur-sm">{t('imageComparison.originalImage')}</span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center justify-center border border-transparent font-medium rounded-md px-2 h-6 min-w-6 text-xs bg-green-600 text-white shadow-lg backdrop-blur-sm">{t('imageComparison.resultImage')}</span>
        </div>
        
        {/* 可拖拽的分割线 */}
        <div 
          ref={sliderRef}
          className={`absolute top-0 bottom-0 z-10 shadow-lg transition-[width,background-color,box-shadow] duration-200 ease-out pointer-events-none ${
            isDragging ? 'bg-blue-400 w-1' : 'bg-white w-0.5 hover:bg-blue-400 hover:w-1'
          }`}
          style={{ 
            left: `${sliderPosition}%`, 
            transform: 'translateX(-50%)',
            transition: isDragging ? 'none' : 'width 0.2s ease-out, background-color 0.2s ease-out, box-shadow 0.2s ease-out'
          }}
        >
          <div className={`absolute top-1/2 left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform cursor-ew-resize items-center justify-center rounded-full border-2 shadow-xl backdrop-blur-sm transition-all duration-200 ease-out ${
            isDragging 
              ? 'border-blue-300 bg-blue-50 opacity-100 scale-110' 
              : 'border-white bg-white opacity-0 group-hover:opacity-100 hover:scale-110 hover:border-blue-300 hover:bg-blue-50'
          }`}>
            <ChevronsLeftRight className={`h-3 w-3 transition-colors ${
              isDragging ? 'text-blue-600' : 'text-gray-600'
            }`} />
          </div>
        </div>
      </div>
    </div>
  )
} 