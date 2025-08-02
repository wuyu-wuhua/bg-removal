'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronsLeftRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface ImageComparisonSliderProps {
  originalImage: string
  processedImage: string
  showPercentage?: boolean
  transparentBackground?: 'checkerboard' | 'white' | 'black' | 'none'
  sliderPosition?: number
  onSliderPositionChange?: (position: number) => void
}

export function ImageComparisonSlider({ 
  originalImage, 
  processedImage, 
  showPercentage = false,
  transparentBackground = 'checkerboard',
  sliderPosition: externalSliderPosition,
  onSliderPositionChange
}: ImageComparisonSliderProps) {
  const { t } = useLanguage()
  const [internalSliderPosition, setInternalSliderPosition] = useState(50)
  const sliderPosition = externalSliderPosition !== undefined ? externalSliderPosition : internalSliderPosition
  const [isDragging, setIsDragging] = useState(false)
  const [dragPosition, setDragPosition] = useState(sliderPosition)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const currentPositionRef = useRef(sliderPosition)

  // 直接更新滑块位置，避免状态更新延迟
  const updateSliderPosition = useCallback((percentage: number) => {
    const clampedPercentage = Math.max(0, Math.min(100, percentage))
    
    // 拖动时直接更新DOM，避免状态更新导致的卡顿
    if (sliderRef.current) {
      sliderRef.current.style.left = `${clampedPercentage}%`
    }
    
    // 只有在非拖动状态或拖动结束时才更新状态
    if (!isDragging) {
      if (onSliderPositionChange) {
        onSliderPositionChange(clampedPercentage)
      } else {
        setInternalSliderPosition(clampedPercentage)
      }
    }
  }, [onSliderPositionChange, isDragging])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !isDragging) return
    
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    
    // 拖动时更新DOM和状态，让图片实时跟随
    if (sliderRef.current) {
      sliderRef.current.style.left = `${percentage}%`
      currentPositionRef.current = percentage
      setDragPosition(percentage)
    }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    
    // 拖动结束时更新状态
    const finalPosition = currentPositionRef.current
    if (onSliderPositionChange) {
      onSliderPositionChange(finalPosition)
    } else {
      setInternalSliderPosition(finalPosition)
    }
    
    // 重置拖动位置
    setDragPosition(finalPosition)
    
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseMove, onSliderPositionChange])

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
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    
    // 拖动时更新DOM和状态，让图片实时跟随
    if (sliderRef.current) {
      sliderRef.current.style.left = `${percentage}%`
      currentPositionRef.current = percentage
      setDragPosition(percentage)
    }
  }

  const handleReactTouchEnd = () => {
    setIsDragging(false)
    
    // 触摸结束时更新状态
    const finalPosition = currentPositionRef.current
    if (onSliderPositionChange) {
      onSliderPositionChange(finalPosition)
    } else {
      setInternalSliderPosition(finalPosition)
    }
    
    // 重置拖动位置
    setDragPosition(finalPosition)
  }

  // 同步外部滑块位置
  useEffect(() => {
    if (externalSliderPosition !== undefined && sliderRef.current) {
      sliderRef.current.style.left = `${externalSliderPosition}%`
      currentPositionRef.current = externalSliderPosition
    }
  }, [externalSliderPosition])

  // 同步内部滑块位置
  useEffect(() => {
    currentPositionRef.current = sliderPosition
    setDragPosition(sliderPosition)
  }, [sliderPosition])

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
            clipPath: `inset(0px ${100 - (isDragging ? dragPosition : sliderPosition)}% 0px 0px)`,
            transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
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
            clipPath: `inset(0px 0px 0px ${isDragging ? dragPosition : sliderPosition}%)`,
            transition: isDragging ? 'none' : 'clip-path 0.1s ease-out'
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
          className={`absolute top-0 bottom-0 z-10 shadow-lg pointer-events-none ${
            isDragging ? 'bg-blue-400 w-1' : 'bg-white w-0.5 hover:bg-blue-400 hover:w-1'
          }`}
          style={{ 
            left: `${isDragging ? dragPosition : sliderPosition}%`, 
            transform: 'translateX(-50%)',
            transition: isDragging ? 'none' : 'all 0.2s ease-out'
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