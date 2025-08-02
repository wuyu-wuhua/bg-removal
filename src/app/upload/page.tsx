'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Download, Plus, RotateCcw, RotateCw, Square, Minus, Maximize, Eraser, Palette, Sparkles, ThumbsUp, ThumbsDown, Trash2, Star, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import BackgroundSelector from '@/components/background-selector'
import ImageComposer from '@/components/image-composer'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import { WipeAnimation } from '@/components/wipe-animation'
import { supabase } from '@/lib/supabase'

/**
 * 压缩图片到符合302.AI限制的尺寸
 */
function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // 计算新的尺寸，确保不超过Stability AI的4,194,304像素限制
      const maxPixels = 4194304
      const currentPixels = img.width * img.height
      
      let newWidth = img.width
      let newHeight = img.height
      
      if (currentPixels > maxPixels) {
        const ratio = Math.sqrt(maxPixels / currentPixels)
        newWidth = Math.floor(img.width * ratio)
        newHeight = Math.floor(img.height * ratio)
        console.log(`压缩图片: ${img.width}x${img.height} -> ${newWidth}x${newHeight}`)
      } else {
        console.log(`图片尺寸符合要求: ${img.width}x${img.height}`)
      }
      
      // 设置canvas尺寸
      canvas.width = newWidth
      canvas.height = newHeight
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)
      
      // 转换为Blob
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        } else {
          resolve(file) // 如果压缩失败，返回原文件
        }
      }, file.type, 0.8) // 80%质量
    }
    
    img.onerror = () => {
      console.error('图片加载失败，使用原文件')
      resolve(file) // 如果加载失败，返回原文件
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export default function UploadPage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()
  const [isUploaded, setIsUploaded] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [showWipeAnimation, setShowWipeAnimation] = useState(false)
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [backgroundSelectorOpen, setBackgroundSelectorOpen] = useState(false)
  const [backgroundSelectorExpanded, setBackgroundSelectorExpanded] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
  const [composedImageUrl, setComposedImageUrl] = useState<string | null>(null)
  const [showComposedImage, setShowComposedImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 主题切换功能
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  // 初始化主题
  useEffect(() => {
    // 检查是否已经设置了主题类
    const hasThemeClass = document.documentElement.classList.contains('dark') || 
                         document.documentElement.classList.contains('light');
    
    if (!hasThemeClass) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
      setTheme(initialTheme)
      document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    } else {
      // 如果已经有主题类，同步状态
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        // 如果是新图片上传，先重置状态
        if (isUploaded) {
          handleNewImageUpload()
        }
        
        // 压缩图片
        const compressedFile = await compressImage(file)
        
        // 先显示本地预览
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
          setIsUploaded(true)
        }
        reader.readAsDataURL(compressedFile)

        // 上传压缩后的文件到Supabase存储
        const formData = new FormData()
        formData.append('file', compressedFile)
        formData.append('userId', user?.id || '')

        const response = await fetch('/api/upload-to-storage', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (data.success) {
          // 保存Supabase存储URL用于背景移除
          setServerImageUrl(data.imageUrl)
          console.log('新图片上传成功，服务器URL:', data.imageUrl)
          console.log('当前状态 - uploadedImage:', uploadedImage)
          console.log('当前状态 - serverImageUrl:', data.imageUrl)
          // 等待状态更新后再开始处理
          setTimeout(() => {
            console.log('开始处理新上传的图片')
            safeHandleRemoveBackground()
            // 滚动到页面顶部，提供更好的用户体验
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 100)
        } else {
          console.error('上传失败:', data.error)
          alert(t('upload.editor.uploadFailed'))
        }
      } catch (error) {
        console.error('上传错误:', error)
        alert(t('upload.editor.uploadFailed'))
      }
    }
    
    // 清空文件输入框，允许重复选择同一文件
    event.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      try {
        // 如果是新图片上传，先重置状态
        if (isUploaded) {
          handleNewImageUpload()
        }
        
        // 压缩图片
        const compressedFile = await compressImage(file)
        
        // 先显示本地预览
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedImage(e.target?.result as string)
          setIsUploaded(true)
        }
        reader.readAsDataURL(compressedFile)

        // 上传压缩后的文件到Supabase存储
        const formData = new FormData()
        formData.append('file', compressedFile)
        formData.append('userId', user?.id || '')

        const response = await fetch('/api/upload-to-storage', {
          method: 'POST',
          body: formData
        })

        const data = await response.json()

        if (data.success) {
          // 保存Supabase存储URL用于背景移除
          setServerImageUrl(data.imageUrl)
          console.log('拖拽上传成功，服务器URL:', data.imageUrl)
          // 等待状态更新后再开始处理
          setTimeout(() => {
            safeHandleRemoveBackground()
            // 滚动到页面顶部，提供更好的用户体验
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }, 100)
        } else {
          console.error('上传失败:', data.error)
          alert(t('upload.editor.uploadFailed'))
        }
      } catch (error) {
        console.error('上传错误:', error)
        alert(t('upload.editor.uploadFailed'))
      }
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          try {
            // 如果是新图片上传，先重置状态
            if (isUploaded) {
              handleNewImageUpload()
            }
            
            // 压缩图片
            const compressedFile = await compressImage(file)
            
            // 先显示本地预览
            const reader = new FileReader()
            reader.onload = (e) => {
              setUploadedImage(e.target?.result as string)
              setIsUploaded(true)
            }
            reader.readAsDataURL(compressedFile)

            // 上传压缩后的文件到Supabase存储
            const formData = new FormData()
            formData.append('file', compressedFile)
            formData.append('userId', user?.id || '')

            const response = await fetch('/api/upload-to-storage', {
              method: 'POST',
              body: formData
            })

            const data = await response.json()

            if (data.success) {
              // 保存Supabase存储URL用于背景移除
              setServerImageUrl(data.imageUrl)
              console.log('粘贴上传成功，服务器URL:', data.imageUrl)
              // 等待状态更新后再开始处理
              setTimeout(() => {
                safeHandleRemoveBackground()
                // 滚动到页面顶部，提供更好的用户体验
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }, 100)
            } else {
              console.error('上传失败:', data.error)
              alert(t('upload.editor.uploadFailed'))
            }
          } catch (error) {
            console.error('上传错误:', error)
            alert(t('upload.editor.uploadFailed'))
          }
        }
        break
      }
    }
  }

  // 示例图片处理函数 - 将本地图片转换为Blob
  const loadExampleImageAsBlob = async (imagePath: string): Promise<File> => {
    try {
      // 使用绝对路径确保正确加载
      const fullPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
      console.log(t('upload.editor.loadExampleImage') + ':', fullPath)
      
      const response = await fetch(fullPath)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      
      // 从路径中提取文件名
      const fileName = imagePath.split('/').pop() || 'example.jpg'
      
      // 创建File对象
      const file = new File([blob], fileName, { type: blob.type })
      console.log(t('upload.editor.exampleLoadSuccess') + ':', fileName, '大小:', blob.size)
      return file
    } catch (error) {
      console.error(t('upload.editor.exampleLoadError') + ':', error)
      throw new Error(`${t('upload.editor.exampleLoadError')}: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  const exampleImages = [
    '/images/金发女人.jpg',
    '/images/葡萄.jpg', 
    '/images/卫生纸.jpg',
    '/images/房子.jpg'
  ]

  // 背景移除处理函数
  const handleRemoveBackground = async () => {
    if (!user || !uploadedImage) return

    setIsProcessing(true)
    setProcessingError(null)

    try {
      // 确保使用服务器图片URL，如果没有则等待上传完成
      if (!serverImageUrl) {
        console.log('serverImageUrl为空，等待图片上传完成...')
        setIsProcessing(false)
        return
      }

      const imageUrl = serverImageUrl
      console.log('开始背景移除处理，使用图片URL:', imageUrl)

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('upload.editor.processingError'))
      }

      setProcessedImage(data.processedImageUrl)
      console.log('背景移除成功:', data)
    } catch (error) {
      console.error('背景移除错误:', error)
      setProcessingError(error instanceof Error ? error.message : t('upload.editor.processingError'))
    } finally {
      setIsProcessing(false)
    }
  }

  // 安全的背景移除处理函数，确保使用正确的图片URL
  const safeHandleRemoveBackground = async () => {
    if (!user || !uploadedImage) return

    // 如果serverImageUrl为空，等待一下再重试
    if (!serverImageUrl) {
      console.log(t('upload.editor.serverUrlWait'))
      setTimeout(() => {
        safeHandleRemoveBackground()
      }, 200)
      return
    }

    await handleRemoveBackground()
  }

  // 重新生成处理结果
  const handleReset = async () => {
    if (!uploadedImage) {
      console.log('没有上传的图片，无法重新生成')
      alert(t('upload.editor.noImageToDownload'))
      return
    }
    
    console.log('开始重新生成背景移除图片')
    
    // 重置状态，但保留serverImageUrl
    setProcessedImage(null)
    setProcessingError(null)
    setShowWipeAnimation(false)
    setSelectedBackground(null)
    setComposedImageUrl(null)
    setShowComposedImage(false)
    
    // 确保有serverImageUrl
    if (!serverImageUrl) {
      console.log('等待serverImageUrl...')
      alert(t('upload.editor.preparingRegenerate'))
      // 等待一下再重试
      setTimeout(() => {
        handleReset()
      }, 1000)
      return
    }
    
    console.log('开始重新处理图片，使用URL:', serverImageUrl)
    
    // 直接调用处理函数
    try {
      setIsProcessing(true)
      await handleRemoveBackground()
      alert(t('upload.editor.regenerateSuccess'))
    } catch (error) {
      console.error('重新生成失败:', error)
      setProcessingError(t('upload.editor.regenerateFailed'))
      alert(t('upload.editor.regenerateRetry'))
    } finally {
      setIsProcessing(false)
    }
  }

  // 重置所有状态（用于上传新图片）
  const handleNewImageUpload = () => {
    console.log(t('upload.editor.resetState'))
    setProcessedImage(null)
    setProcessingError(null)
    setShowWipeAnimation(false)
    setServerImageUrl(null) // 重置服务器URL，确保使用新图片
    setIsUploaded(false)
    setUploadedImage(null)
  }

  // 处理背景选择
  const handleBackgroundSelect = (backgroundUrl: string) => {
    console.log('选择背景图片:', backgroundUrl)
    setSelectedBackground(backgroundUrl)
    setShowComposedImage(true)
    
    // 自动开始合成图片
    setTimeout(() => {
      if (processedImage && backgroundUrl) {
        console.log('开始自动合成图片')
        // 这里会触发ImageComposer组件的useEffect，自动合成图片
      }
    }, 100)
    
    // 关闭背景选择器
    setBackgroundSelectorOpen(false)
    setBackgroundSelectorExpanded(false) // 关闭展开的背景选择器
  }

  // 处理图片合成完成
  const handleCompositionComplete = (composedUrl: string) => {
    console.log('图片合成完成，URL:', composedUrl)
    setComposedImageUrl(composedUrl)
  }

  // 重置背景选择
  const handleResetBackground = () => {
    console.log('重置背景，回到透明背景状态')
    setSelectedBackground(null)
    setComposedImageUrl(null)
    setShowComposedImage(false)
    alert(t('upload.editor.resetToTransparentSuccess'))
  }

  // 重新上传图片
  const handleReupload = () => {
    setUploadedImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
    setProcessingError(null)
    setShowWipeAnimation(false)
    setServerImageUrl(null)
    setSelectedBackground(null)
    setComposedImageUrl(null)
    setShowComposedImage(false)
    setIsUploaded(false)
  }

  // 下载处理后的图片
  const handleDownload = async () => {
    // 根据当前状态决定下载哪个图片
    let imageToDownload = null
    let fileName = ''
    
    if (showComposedImage && composedImageUrl) {
      // 如果有合成图片，下载合成后的图片
      imageToDownload = composedImageUrl
      fileName = `composed-image-${Date.now()}.png`
      console.log('下载合成后的图片:', imageToDownload)
    } else if (processedImage) {
      // 否则下载背景消除后的透明图片
      imageToDownload = processedImage
      fileName = `background-removed-${Date.now()}.png`
      console.log('下载背景消除后的图片:', imageToDownload)
    } else {
      console.log('没有可下载的图片')
      alert(t('upload.editor.noImageToDownload'))
      return
    }
    
    try {
      // 简化下载逻辑，直接尝试下载
      const response = await fetch(imageToDownload, {
        mode: 'cors',
        credentials: 'omit'
      })
      
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status}`)
      }
      
      const blob = await response.blob()
      console.log('下载成功，大小:', blob.size, 'bytes')
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.style.display = 'none'
      
      // 添加到DOM并触发下载
      document.body.appendChild(link)
      link.click()
      
      // 清理
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('下载完成')
      alert(t('upload.editor.downloadSuccess'))
    } catch (error) {
      console.error('下载失败:', error)
      
      // 备选方案：在新窗口打开图片
      try {
        console.log('尝试在新窗口打开图片')
        window.open(imageToDownload, '_blank')
        alert(t('upload.editor.imageOpenedInNewWindow'))
      } catch (finalError) {
        console.error('所有下载方法都失败:', finalError)
        alert(t('upload.editor.downloadFailedRightClick'))
      }
    }
  }

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!loading && !user) {
      window.location.href = '/login'
    }
  }, [user, loading])

  if (isUploaded && uploadedImage) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <Navbar currentPage="upload" theme={theme} onThemeToggle={toggleTheme} />
        
        <main className="flex-1 flex min-h-0">
          {/* 主内容区域 */}
          <div className="flex-1 flex flex-col min-h-0 h-full">


            {/* 图片显示区域 */}
            <div className="flex-1 flex items-start justify-center p-4 bg-gray-50 dark:bg-gray-800 min-h-0">
              <div className="relative w-full max-w-5xl mt-4">
                {/* 桌面端按钮 - 保持原有布局 */}
                <div className="hidden md:block">
                  {/* 重新上传按钮 - 移到左侧 */}
                  <div className="absolute top-0 left-8 z-20">
                    <Button
                      onClick={handleReupload}
                      variant="outline"
                      size="sm"
                      className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 shadow-lg backdrop-blur-sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {t('upload.editor.reupload')}
                    </Button>
                  </div>
                  
                  {/* 放置背景按钮 - 移到右侧 */}
                  <div className="absolute top-0 -right-16 z-20">
                    {processedImage && !isProcessing && (
                      <Button 
                        onClick={() => setBackgroundSelectorExpanded(!backgroundSelectorExpanded)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {showComposedImage ? t('upload.editor.changeBackground') : t('upload.editor.placeBackground')}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start justify-between gap-8">
                  {/* 主图片区域 */}
                  <div className="relative flex-1">

                    {uploadedImage && !processedImage && !isProcessing && (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt={t('upload.editor.originalImageAlt')} 
                          className="w-full max-h-[50vh] md:max-h-[70vh] object-contain rounded-lg shadow-lg"
                        />
                      </div>
                    )}
                    
                    {isProcessing && (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt={t('upload.editor.originalImageAlt')} 
                          className="w-full max-h-[50vh] md:max-h-[70vh] object-contain rounded-lg shadow-lg opacity-50"
                        />
                        {/* 加载动画覆盖层 */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                          <div className="text-center">
                            <Loader2 className="h-16 w-16 animate-spin text-white mx-auto mb-4" />
                            <p className="text-white text-lg font-semibold">{t('upload.editor.processing')}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                                        {processedImage && !isProcessing && !showComposedImage && (
                      <div className="relative">
                        {/* 透明背景网格 - 放在最底层 */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none rounded-lg z-0" 
                             style={{
                               backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                                 linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                                 linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                                 linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                               backgroundSize: '20px 20px',
                               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                             }}
                        />
                        <img 
                          src={processedImage} 
                          alt={t('upload.editor.processedImageAlt')} 
                          className="w-full max-h-[50vh] md:max-h-[70vh] object-contain relative z-10 rounded-lg shadow-lg pointer-events-none"
                        />
                        
                        {/* 桌面端右下角圆形按钮 */}
                        <div className="hidden md:flex absolute bottom-4 right-4 space-x-3 z-20">
                          <Button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('重新生成按钮被点击')
                              handleReset()
                            }}
                            disabled={isProcessing}
                            size="sm"
                            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title={t('upload.editor.regenerate')}
                          >
                            <RotateCcw className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('下载按钮被点击')
                              handleDownload()
                            }}
                            disabled={isProcessing}
                            size="sm"
                            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title={t('upload.editor.download')}
                          >
                            <Download className="h-5 w-5 text-white" />
                          </Button>
                        </div>
                        

                      </div>
                    )}

                    {/* 显示合成后的图片 */}
                    {showComposedImage && selectedBackground && processedImage && (
                      <div className="relative">
                        <ImageComposer
                          foregroundImage={processedImage}
                          backgroundImage={selectedBackground}
                          onDownload={handleCompositionComplete}
                        />
                        
                        {/* 桌面端合成图片的按钮 */}
                        <div className="hidden md:flex absolute bottom-4 right-4 space-x-3 z-20">
                          <Button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('重新生成按钮被点击')
                              handleReset()
                            }}
                            disabled={isProcessing}
                            size="sm"
                            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title={t('upload.editor.regenerate')}
                          >
                            <RotateCcw className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('下载按钮被点击')
                              handleDownload()
                            }}
                            disabled={isProcessing}
                            size="sm"
                            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title={t('upload.editor.download')}
                          >
                            <Download className="h-5 w-5 text-white" />
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              console.log('返回透明背景按钮被点击')
                              handleResetBackground()
                            }}
                            size="sm"
                            className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                            title={t('upload.editor.resetToTransparent')}
                          >
                            <RotateCw className="h-5 w-5 text-white" />
                          </Button>
                        </div>
                        

                      </div>
                    )}
                    
                    {!uploadedImage && (
                      <div className="flex items-center justify-center h-[50vh] md:h-[70vh] bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('upload.editor.uploadAndProcess')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 桌面端展开的背景选择器 - 紧挨着右侧按钮 */}
                  {backgroundSelectorExpanded && processedImage && (
                    <div className="hidden md:block absolute top-12 -right-48 z-20 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[70vh]">
                      <BackgroundSelector
                        isOpen={true}
                        onClose={() => setBackgroundSelectorExpanded(false)}
                        onSelectBackground={handleBackgroundSelect}
                        currentImageUrl={processedImage || undefined}
                        isExpanded={true}
                      />
                    </div>
                  )}
                  
                  {/* 移动端展开的背景选择器 - 从底部展开 */}
                  {backgroundSelectorExpanded && processedImage && (
                    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {t('upload.editor.placeBackground')}
                        </h3>
                        <Button
                          onClick={() => setBackgroundSelectorExpanded(false)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
                        <BackgroundSelector
                          isOpen={true}
                          onClose={() => setBackgroundSelectorExpanded(false)}
                          onSelectBackground={handleBackgroundSelect}
                          currentImageUrl={processedImage || undefined}
                          isExpanded={true}
                        />
                      </div>
                    </div>
                  )}

                </div>
                
                {/* 移动端按钮区域 - 放在图片和Footer之间 */}
                {processedImage && !isProcessing && (
                  <div className="md:hidden mt-4 mb-4 flex justify-center">
                    <div className="flex space-x-6">
                      <div className="flex flex-col items-center space-y-1">
                        <Button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('下载按钮被点击')
                            handleDownload()
                          }}
                          disabled={isProcessing}
                          size="sm"
                          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Download className="h-4 w-4 text-white" />
                        </Button>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{t('upload.editor.download')}</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <Button 
                          onClick={() => setBackgroundSelectorExpanded(!backgroundSelectorExpanded)}
                          size="sm"
                          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus className="h-4 w-4 text-white" />
                        </Button>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{t('upload.editor.changeBackground')}</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <Button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('重新生成按钮被点击')
                            handleReset()
                          }}
                          disabled={isProcessing}
                          size="sm"
                          className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer backdrop-blur-sm"
                        >
                          <RotateCcw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </Button>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{t('upload.editor.regenerate')}</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <Button 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            console.log('返回透明背景按钮被点击')
                            handleResetBackground()
                          }}
                          disabled={isProcessing}
                          size="sm"
                          className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <RotateCw className="h-4 w-4 text-white" />
                        </Button>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{t('upload.editor.resetToTransparent')}</span>
                      </div>
                      <div className="flex flex-col items-center space-y-1">
                        <Button 
                          onClick={handleReupload}
                          disabled={isProcessing}
                          size="sm"
                          className="w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Upload className="h-4 w-4 text-white" />
                        </Button>
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{t('upload.editor.reupload')}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* 桌面端按钮区域 - 放在图片下方 */}
                {uploadedImage && !processedImage && (
                  <div className="mt-8 flex justify-center">
                    <Button 
                      onClick={safeHandleRemoveBackground}
                      disabled={isProcessing}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      {t('upload.editor.removeBackground')}
                    </Button>
                  </div>
                )}
                

              </div>
            </div>


          </div>


        </main>

        {/* 移动端Footer - 放在按钮下方 */}
        <div className="md:hidden mt-2 pb-4">
          <Footer onContactClick={() => setHelpOpen(true)} />
        </div>

        {/* 桌面端Footer - 保持原有位置 */}
        <div className="hidden md:block mt-auto">
          <Footer onContactClick={() => setHelpOpen(true)} />
        </div>
        <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
        
        {/* 背景选择器 */}
        <BackgroundSelector
          isOpen={backgroundSelectorOpen}
          onClose={() => setBackgroundSelectorOpen(false)}
          onSelectBackground={handleBackgroundSelect}
          currentImageUrl={processedImage || undefined}
        />
        
        {/* 隐藏的文件输入框 - 用于已上传状态下的新图片上传 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar currentPage="upload" theme={theme} onThemeToggle={toggleTheme} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl text-center">
          {/* 主标题 */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {t('upload.title')}
          </h1>

          {/* 上传区域 */}
          <Card 
            className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <CardContent className="p-12">
              <div 
                className="space-y-6"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onPaste={handlePaste}
              >
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-10 w-10 text-blue-600" />
                </div>
                
                <div>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation() // 防止触发父元素的点击事件
                      fileInputRef.current?.click()
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {t('upload.uploadArea.title')}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                <p className="text-gray-600 dark:text-gray-400">
                  {t('upload.uploadArea.dragDrop')}
                </p>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('upload.uploadArea.paste')} <span className="underline cursor-pointer">{t('upload.uploadArea.url')}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 示例图片 */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {t('upload.uploadArea.examples')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {exampleImages.map((image, index) => (
                <div 
                  key={index}
                  className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 overflow-hidden group relative"
                  onClick={async () => {
                    console.log('示例图片被点击:', image)
                    console.log('当前用户状态:', user)
                    console.log('用户ID:', user?.id)
                    console.log('用户邮箱:', user?.email)
                    
                    if (!user) {
                      console.log(t('upload.editor.userNotLoggedIn'))
                      window.location.href = '/login'
                      return
                    }
                    
                    if (!user.id) {
                      console.error(t('upload.editor.userIdEmpty'))
                      alert(t('upload.editor.userIdError'))
                      return
                    }
                    
                    try {
                      console.log('开始处理示例图片...')
                      
                      // 如果是新图片上传，先重置状态
                      if (isUploaded) {
                        console.log('重置上传状态')
                        handleNewImageUpload()
                      }
                      
                      console.log('加载示例图片:', image)
                      
                      // 将示例图片转换为File对象
                      const imageFile = await loadExampleImageAsBlob(image)
                      console.log('示例图片加载成功:', imageFile.name, '大小:', imageFile.size)
                      
                      // 压缩图片
                      const compressedFile = await compressImage(imageFile)
                      console.log('图片压缩完成:', compressedFile.name, '大小:', compressedFile.size)
                      
                      // 创建本地URL用于显示
                      const localUrl = URL.createObjectURL(compressedFile)
                      setUploadedImage(localUrl)
                      console.log('设置本地图片URL')
                      
                      // 上传到Supabase存储 - 使用安全的文件名
                      const safeFileName = compressedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
                      const fileName = `example_${Date.now()}_${safeFileName}`
                      console.log('开始上传到Supabase:', fileName)
                      console.log('用户ID:', user.id)
                      console.log('完整路径:', `${user.id}/${fileName}`)
                      
                      const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('bg-removal-images')
                        .upload(`${user.id}/${fileName}`, compressedFile)
                      
                      if (uploadError) {
                        console.error('上传示例图片失败:', uploadError)
                        throw new Error(`上传示例图片失败: ${uploadError.message}`)
                      }
                      
                      console.log('上传成功:', uploadData)
                      
                      // 获取上传后的URL
                      const { data: urlData } = supabase.storage
                        .from('bg-removal-images')
                        .getPublicUrl(`${user.id}/${fileName}`)
                      
                      setServerImageUrl(urlData.publicUrl)
                      console.log('设置服务器图片URL:', urlData.publicUrl)
                      
                      setIsUploaded(true)
                      console.log('设置上传状态为true')
                      
                      console.log('示例图片处理完成，开始背景移除')
                      
                      // 等待状态更新后再开始处理
                      setTimeout(() => {
                        console.log('开始背景移除处理')
                        safeHandleRemoveBackground()
                        // 滚动到页面顶部，提供更好的用户体验
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }, 100)
                      
                    } catch (error) {
                      console.error('处理示例图片失败:', error)
                      const errorMessage = error instanceof Error ? error.message : t('upload.editor.exampleLoadFailed')
                      setProcessingError(errorMessage)
                      alert(`${t('upload.editor.exampleProcessFailed')}: ${errorMessage}`)
                    }
                  }}
                >
                  <img 
                    src={image} 
                    alt={`示例图片 ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // 如果图片加载失败，显示占位符
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center h-full">示例 ${index + 1}</span>`;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {t('upload.uploadArea.clickToUse')}
                    </span>
                  </div>
                  {/* 图片描述 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <span className="text-white text-xs font-medium">
                      {t('upload.uploadArea.exampleImages')[index]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 底部说明 */}
          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            {t('upload.footer.termsAgreement')}{' '}
            <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('upload.footer.termsLink')}
            </Link>
            {t('upload.footer.privacyInfo')}{' '}
            <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              {t('upload.footer.privacyLink')}
            </Link>
            。
          </div>
        </div>
      </main>

      <Footer onContactClick={() => setHelpOpen(true)} />
      <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
} 