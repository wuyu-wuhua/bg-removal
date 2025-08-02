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
          // 设置画布尺寸为背景图片尺寸
          canvas.width = bgImg.width
          canvas.height = bgImg.height
          
          // 绘制背景图片
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
          
          // 计算前景图片的位置和尺寸，保持比例
          const fgAspectRatio = fgImg.width / fgImg.height
          const bgAspectRatio = canvas.width / canvas.height
          
          let fgWidth, fgHeight, fgX, fgY
          
          if (fgAspectRatio > bgAspectRatio) {
            // 前景图片更宽，以宽度为准
            fgWidth = canvas.width * 0.8 // 占背景宽度的80%
            fgHeight = fgWidth / fgAspectRatio
            fgX = (canvas.width - fgWidth) / 2
            fgY = (canvas.height - fgHeight) / 2
          } else {
            // 前景图片更高，以高度为准
            fgHeight = canvas.height * 0.8 // 占背景高度的80%
            fgWidth = fgHeight * fgAspectRatio
            fgX = (canvas.width - fgWidth) / 2
            fgY = (canvas.height - fgHeight) / 2
          }
          
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
        <div className="flex items-center justify-center h-[70vh] bg-gray-100 dark:bg-gray-800 rounded-lg">
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
            className="w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
          />

        </div>
      ) : (
        <div className="flex items-center justify-center h-[70vh] bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 text-lg">准备合成图片...</p>
        </div>
      )}
    </div>
  )
} 