'use client'

import React, { useRef, useEffect, useState } from 'react'

import { Button } from './ui/button'

interface ImageComposerProps {
  foregroundImage: string // 透明背景的图片
  backgroundImage: string // 新的背景图片
  onDownload?: (composedImageUrl: string) => void
}

export default function ImageComposer({
  foregroundImage,
  backgroundImage,
  onDownload
}: ImageComposerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [composedImageUrl, setComposedImageUrl] = useState<string | null>(null)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    if (foregroundImage && backgroundImage) {
      console.log('开始自动合成图片，背景URL:', backgroundImage)
      // 重置合成状态
      setComposedImageUrl(null)
      setIsComposing(true)
      composeImages()
    }
  }, [foregroundImage, backgroundImage])

  const composeImages = async () => {
    if (!canvasRef.current) return

    setIsComposing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    try {
      // 加载背景图片
      const bgImg = new Image()
      bgImg.crossOrigin = 'anonymous'
      
      bgImg.onload = () => {
        // 加载前景图片（透明背景）
        const fgImg = new Image()
        fgImg.crossOrigin = 'anonymous'
        
        fgImg.onload = () => {
          // 设置画布尺寸为前景图片尺寸，确保主体位置不变
          canvas.width = fgImg.width
          canvas.height = fgImg.height
          
          // 绘制背景图片，铺满整个画框
          // 计算背景图片的缩放比例，确保完全覆盖画布
          const bgAspectRatio = bgImg.width / bgImg.height
          const canvasAspectRatio = canvas.width / canvas.height
          
          let bgWidth, bgHeight, bgX, bgY
          
          if (bgAspectRatio > canvasAspectRatio) {
            // 背景图片更宽，以高度为准进行缩放
            bgHeight = canvas.height
            bgWidth = bgHeight * bgAspectRatio
            bgX = (canvas.width - bgWidth) / 2
            bgY = 0
          } else {
            // 背景图片更高，以宽度为准进行缩放
            bgWidth = canvas.width
            bgHeight = bgWidth / bgAspectRatio
            bgX = 0
            bgY = (canvas.height - bgHeight) / 2
          }
          
          // 绘制背景图片，确保铺满整个画框
          ctx.drawImage(bgImg, bgX, bgY, bgWidth, bgHeight)
          
          // 保持前景图片的原始位置和尺寸，不进行居中调整
          // 这样在更换背景时主体位置保持不变
          const fgWidth = fgImg.width
          const fgHeight = fgImg.height
          const fgX = 0
          const fgY = 0
          
          // 绘制前景图片
          ctx.drawImage(fgImg, fgX, fgY, fgWidth, fgHeight)
          
          // 生成合成图片的URL
          const composedUrl = canvas.toDataURL('image/png', 0.9)
          setComposedImageUrl(composedUrl)
          setIsComposing(false)
          
          console.log('图片合成完成')
          
          if (onDownload) {
            onDownload(composedUrl)
          }
        }
        
        fgImg.onerror = () => {
          console.error('加载前景图片失败')
          setIsComposing(false)
        }
        
        fgImg.src = foregroundImage
      }
      
      bgImg.onerror = () => {
        console.error('加载背景图片失败')
        setIsComposing(false)
      }
      
      bgImg.src = backgroundImage
    } catch (error) {
      console.error('合成图片失败:', error)
      setIsComposing(false)
    }
  }



  return (
    <div className="relative">
      {/* 隐藏的canvas用于合成 */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      
      {/* 显示合成结果 */}
      {isComposing ? (
        <div className="flex items-center justify-center h-[70vh] bg-transparent">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">正在合成图片...</p>
          </div>
        </div>
      ) : composedImageUrl ? (
        <div className="relative">
          <img
            src={composedImageUrl}
            alt="合成后的图片"
            className="w-full max-h-[70vh] object-contain"
          />

        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh] bg-transparent">
          <p className="text-gray-600 dark:text-gray-400 text-lg">准备合成图片...</p>
        </div>
      )}
    </div>
  )
} 