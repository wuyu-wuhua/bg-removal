'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Upload, Download, Plus, RotateCcw, RotateCw, Square, Minus, Maximize, Eraser, Palette, Sparkles, ThumbsUp, ThumbsDown, Trash2, Star, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
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
      // 计算新的尺寸，确保不超过4,200,000像素
      const maxPixels = 4200000
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
          // 等待状态更新后再开始处理
          setTimeout(() => {
            safeHandleRemoveBackground()
          }, 100)
        } else {
          console.error('上传失败:', data.error)
          alert('图片上传失败，请重试')
        }
      } catch (error) {
        console.error('上传错误:', error)
        alert('图片上传失败，请重试')
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
          }, 100)
        } else {
          console.error('上传失败:', data.error)
          alert('图片上传失败，请重试')
        }
      } catch (error) {
        console.error('上传错误:', error)
        alert('图片上传失败，请重试')
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
              }, 100)
            } else {
              console.error('上传失败:', data.error)
              alert('图片上传失败，请重试')
            }
          } catch (error) {
            console.error('上传错误:', error)
            alert('图片上传失败，请重试')
          }
        }
        break
      }
    }
  }

  // 示例图片处理函数 - 将本地图片转换为Blob
  const loadExampleImageAsBlob = async (imagePath: string): Promise<File> => {
    try {
      const response = await fetch(imagePath)
      const blob = await response.blob()
      
      // 从路径中提取文件名
      const fileName = imagePath.split('/').pop() || 'example.jpg'
      
      // 创建File对象
      const file = new File([blob], fileName, { type: blob.type })
      return file
    } catch (error) {
      console.error('加载示例图片失败:', error)
      throw error
    }
  }

  const exampleImages = [
    '/images/外国男人.jpg',
    '/images/兔子.jpg', 
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
        throw new Error(data.error || '处理失败')
      }

      setProcessedImage(data.processedImageUrl)
      console.log('背景移除成功:', data)
      
      // 立即开始擦除动画
      setShowWipeAnimation(true)
    } catch (error) {
      console.error('背景移除错误:', error)
      setProcessingError(error instanceof Error ? error.message : '处理失败')
    } finally {
      setIsProcessing(false)
    }
  }

  // 安全的背景移除处理函数，确保使用正确的图片URL
  const safeHandleRemoveBackground = async () => {
    if (!user || !uploadedImage) return

    // 如果serverImageUrl为空，等待一下再重试
    if (!serverImageUrl) {
      console.log('等待serverImageUrl更新...')
      setTimeout(() => {
        safeHandleRemoveBackground()
      }, 200)
      return
    }

    await handleRemoveBackground()
  }

  // 重置处理结果
  const handleReset = () => {
    setProcessedImage(null)
    setProcessingError(null)
    setShowWipeAnimation(false)
    setServerImageUrl(null)
  }

  // 重置所有状态（用于上传新图片）
  const handleNewImageUpload = () => {
    console.log('重置状态，准备上传新图片')
    setProcessedImage(null)
    setProcessingError(null)
    setShowWipeAnimation(false)
    // 不重置serverImageUrl，让它在新的图片上传成功后更新
    setIsUploaded(false)
    setUploadedImage(null)
  }

  // 下载处理后的图片
  const handleDownload = async () => {
    if (!processedImage) return

    try {
      console.log('开始下载图片:', processedImage)
      
      // 通过fetch下载图片，避免跨域问题
      const response = await fetch(processedImage, {
        mode: 'cors', // 启用跨域
        credentials: 'omit' // 不发送cookies
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const blob = await response.blob()
      console.log('图片下载成功，大小:', blob.size, 'bytes')
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `background-removed-${Date.now()}.png`
      link.style.display = 'none'
      
      // 添加到DOM并触发下载
      document.body.appendChild(link)
      link.click()
      
      // 清理
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      console.log('下载完成')
    } catch (error) {
      console.error('下载失败:', error)
      
      // 如果fetch失败，尝试直接打开链接
      try {
        console.log('尝试直接下载链接')
        const link = document.createElement('a')
        link.href = processedImage
        link.download = `background-removed-${Date.now()}.png`
        link.target = '_blank' // 在新窗口打开
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        console.log('直接下载链接已触发')
      } catch (directError) {
        console.error('直接下载也失败:', directError)
        alert('下载失败，请右键点击图片选择"另存为"')
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
          {/* 左侧工具栏 */}
          <div className="w-16 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col items-center space-y-4">
            <Button variant="outline" size="sm" className="w-10 h-10 rounded-full">
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 rounded-full">
              <Square className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 rounded-full">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="w-10 h-10 rounded-full">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          {/* 主内容区域 */}
          <div className="flex-1 flex flex-col min-h-0 h-full">


            {/* 图片显示区域 */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 min-h-0">
              <div className="relative w-full max-w-6xl mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* 原图 */}
                  <div className="relative">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('upload.editor.originalImage')}</h3>
                    </div>
                    <img 
                      src={uploadedImage} 
                      alt="原图" 
                      className="w-full max-h-[60vh] object-contain"
                    />
                  </div>

                  {/* 处理后图片 */}
                  <div className="relative">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('upload.editor.processedImage')}</h3>
                      {isProcessing && (
                        <div className="flex items-center text-blue-600">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm">{t('upload.editor.processing')}</span>
                        </div>
                      )}
                      {processingError && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">{t('upload.editor.processingFailed')}</span>
                        </div>
                      )}
                      {processedImage && !showWipeAnimation && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">{t('upload.editor.processingComplete')}</span>
                        </div>
                      )}
                      {showWipeAnimation && (
                        <div className="flex items-center text-purple-600">
                          <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                          <span className="text-sm">{t('upload.editor.showEffect')}</span>
                        </div>
                      )}
                    </div>
                    
                    {processedImage ? (
                      <div className="relative">
                        {/* 透明背景网格 - 放在最底层 */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" 
                             style={{
                               backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                                linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                                linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                                linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                               backgroundSize: '20px 20px',
                               backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                             }}>
                        </div>
                        
                        {showWipeAnimation ? (
                          <WipeAnimation
                            originalImage={uploadedImage}
                            processedImage={processedImage}
                            isActive={showWipeAnimation}
                            onComplete={() => {
                              setTimeout(() => {
                                setShowWipeAnimation(false)
                              }, 300)
                            }}
                            duration={1500}
                            className="w-full max-h-[60vh] relative z-10"
                          />
                        ) : (
                          <img 
                            src={processedImage} 
                            alt="处理后图片" 
                            className="w-full max-h-[60vh] object-contain relative z-10"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[60vh] bg-gray-100 dark:bg-gray-800">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>{t('upload.editor.uploadAndProcess')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 底部控制栏 */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <img src={uploadedImage} alt="缩略图" className="w-12 h-12 object-cover rounded" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{t('upload.editor.rating')}</span>
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧工具栏 */}
          <div className="w-64 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
            <div className="space-y-6">
              {/* 背景移除按钮 */}
              <Button 
                onClick={safeHandleRemoveBackground}
                disabled={isProcessing || !uploadedImage}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-6 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('upload.editor.processing')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('upload.editor.removeBackground')}
                  </>
                )}
              </Button>

              {/* 重置按钮 */}
              {processedImage && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="w-full mb-6"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('upload.editor.reprocess')}
                </Button>
              )}

              {/* 下载按钮 */}
              {processedImage && (
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-6"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t('upload.editor.downloadResult')}
                </Button>
              )}
              
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mb-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                {t('upload.editor.createAIScene')}
              </Button>
              
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{t('upload.editor.background')}</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{t('upload.editor.backgroundNew')}</span>
              </div>
              

              
              <div className="flex items-center space-x-3">
                <Palette className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{t('upload.editor.effects')}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Sparkles className="h-5 w-5 text-gray-600" />
                <span className="font-medium">{t('upload.editor.createDesign')}</span>
              </div>
            </div>
          </div>
        </main>

        {/* 右侧浮动状态栏 */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 space-y-1">
          <div className="text-center text-xs font-medium">1</div>
          <div className="text-center text-xs text-gray-600">2.1 K/s</div>
          <div className="text-center text-xs text-gray-600">0.0 K/s</div>
          <div className="text-center text-xs text-gray-600">$</div>
          <div className="text-center text-xs text-gray-600">□</div>
          <div className="text-center text-xs text-gray-600">🔍</div>
        </div>

        <div className="mt-auto">
          <Footer onContactClick={() => setHelpOpen(true)} />
        </div>
        <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
        
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
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl text-center">
          {/* 返回按钮 */}
          <div className="flex items-center justify-start mb-8">
            <Link href="/" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('upload.backToHome')}
            </Link>
          </div>

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
                
                <p className="text-sm text-gray-500 dark:text-gray-500">
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
                    if (!user) {
                      alert('请先登录')
                      return
                    }
                    
                    try {
                      // 如果是新图片上传，先重置状态
                      if (isUploaded) {
                        handleNewImageUpload()
                      }
                      
                      console.log('加载示例图片:', image)
                      
                      // 将示例图片转换为File对象
                      const imageFile = await loadExampleImageAsBlob(image)
                      
                      // 压缩图片
                      const compressedFile = await compressImage(imageFile)
                      
                      // 创建本地URL用于显示
                      const localUrl = URL.createObjectURL(compressedFile)
                      setUploadedImage(localUrl)
                      
                      // 上传到Supabase存储
                      const fileName = `example_${Date.now()}_${compressedFile.name}`
                      const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('images')
                        .upload(`${user.id}/${fileName}`, compressedFile)
                      
                      if (uploadError) {
                        console.error('上传示例图片失败:', uploadError)
                        throw new Error('上传示例图片失败')
                      }
                      
                      // 获取上传后的URL
                      const { data: urlData } = supabase.storage
                        .from('images')
                        .getPublicUrl(`${user.id}/${fileName}`)
                      
                      setServerImageUrl(urlData.publicUrl)
                      setIsUploaded(true)
                      
                      console.log('示例图片处理完成，开始背景移除')
                      
                      // 等待状态更新后再开始处理
                      setTimeout(() => {
                        safeHandleRemoveBackground()
                      }, 100)
                      
                    } catch (error) {
                      console.error('处理示例图片失败:', error)
                      alert('加载示例图片失败，请重试')
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
                    <span className="text-white text-xs">
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