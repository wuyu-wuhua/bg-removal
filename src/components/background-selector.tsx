'use client'

import React, { useState, useEffect } from 'react'
import { Search, X, Download, Check, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { searchPexelsPhotos, getPopularBackgrounds, getCuratedPhotos, PexelsPhoto } from '@/lib/pexels-api'
import { useLanguage } from '@/contexts/language-context'

interface BackgroundSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectBackground: (imageUrl: string) => void
  currentImageUrl?: string
  isExpanded?: boolean
}

export default function BackgroundSelector({
  isOpen,
  onClose,
  onSelectBackground,
  currentImageUrl,
  isExpanded = false
}: BackgroundSelectorProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [backgrounds, setBackgrounds] = useState<PexelsPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<{success?: boolean, message?: string} | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)

  // 加载初始背景图片
  useEffect(() => {
    if (isOpen) {
      loadInitialBackgrounds()
    }
  }, [isOpen])

  const loadInitialBackgrounds = async () => {
    setLoading(true)
    setError(null)
    try {
      // 获取精选图片作为初始背景
      const response = await getCuratedPhotos(1, 20)
      setBackgrounds(response.photos)
      setHasMore(!!response.next_page)
      setCurrentPage(1)
    } catch (error) {
      console.error('加载初始背景失败:', error)
      setError(t('upload.editor.loadBackgroundsFailed'))
      // 如果API失败，使用一些默认背景
      setBackgrounds([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (page: number = 1) => {
    if (!searchQuery.trim()) {
      // 如果搜索框为空，加载热门背景
      await loadPopularBackgrounds(page)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await searchPexelsPhotos(searchQuery, page, 20)
      if (page === 1) {
        setBackgrounds(response.photos)
      } else {
        setBackgrounds(prev => [...prev, ...response.photos])
      }
      setHasMore(!!response.next_page)
      setCurrentPage(page)
    } catch (error) {
      console.error('搜索背景图片失败:', error)
      setError(t('upload.editor.searchFailed'))
    } finally {
      setLoading(false)
    }
  }

  const loadPopularBackgrounds = async (page: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPopularBackgrounds(page, 20)
      if (page === 1) {
        setBackgrounds(response.photos)
      } else {
        setBackgrounds(prev => [...prev, ...response.photos])
      }
      setHasMore(!!response.next_page)
      setCurrentPage(page)
    } catch (error) {
      console.error('加载热门背景失败:', error)
      setError(t('upload.editor.loadBackgroundsFailed'))
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (searchQuery.trim()) {
      handleSearch(currentPage + 1)
    } else {
      loadPopularBackgrounds(currentPage + 1)
    }
  }

  const handleSelectBackground = (background: PexelsPhoto) => {
    setSelectedBackground(background.src.large)
    // 立即应用背景
    onSelectBackground(background.src.large)
  }

  const handleApplyBackground = () => {
    // 背景已经在选择时立即应用了，这里只需要关闭选择器
    onClose()
  }

  const handleDownloadBackground = async (background: PexelsPhoto) => {
    setDownloadingId(background.id)
    setDownloadStatus(null)
    
    try {
      console.log('开始下载背景图片:', background.src.large)
      
      // 尝试直接下载
      const response = await fetch(background.src.large, {
        mode: 'cors',
        credentials: 'omit'
      })
      
      if (!response.ok) {
        throw new Error(`下载失败: ${response.status}`)
      }
      
      const blob = await response.blob()
      console.log('背景图片下载成功，大小:', blob.size, 'bytes')
      
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `background-${background.id}.jpg`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setDownloadStatus({ success: true, message: '背景图片下载成功！' })
      setTimeout(() => setDownloadStatus(null), 3000)
      
    } catch (error) {
      console.error('直接下载失败，尝试使用API代理:', error)
      
      try {
        // 使用API代理下载
        const proxyResponse = await fetch('/api/download-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: background.src.large })
        })
        
        if (!proxyResponse.ok) {
          throw new Error(`API代理下载失败: ${proxyResponse.status}`)
        }
        
        const blob = await proxyResponse.blob()
        console.log('API代理下载成功，大小:', blob.size, 'bytes')
        
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `background-${background.id}.jpg`
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        setDownloadStatus({ success: true, message: '背景图片下载成功！' })
        setTimeout(() => setDownloadStatus(null), 3000)
        
      } catch (proxyError) {
        console.error('API代理下载也失败:', proxyError)
        setDownloadStatus({ success: false, message: '下载失败，请右键点击图片选择"另存为"' })
        setTimeout(() => setDownloadStatus(null), 5000)
      }
    } finally {
      setDownloadingId(null)
    }
  }

  if (!isOpen) return null

  // 如果是展开模式，不显示弹窗背景
  if (isExpanded) {
    return (
      <div className="w-full">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {t('upload.editor.selectBackground')}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {t('upload.editor.pexelsDescription')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('upload.editor.searchBackground')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <Button
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    {t('upload.editor.loading')}
                  </>
                ) : (
                  t('upload.editor.searchBackground')
                )}
              </Button>
            </div>
            
            {/* 热门搜索标签已删除 */}
          </div>



          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Download Status Message */}
          {downloadStatus && (
            <div className={`p-3 border ${
              downloadStatus.success 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <p className={`text-xs ${
                downloadStatus.success 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {downloadStatus.message}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 max-h-[50vh]">
            {loading && backgrounds.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">{t('upload.editor.loading')}</span>
              </div>
            ) : backgrounds.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                {error ? t('upload.editor.noResults') : t('upload.editor.searchForBackgrounds')}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {backgrounds.map((background) => (
                  <div
                    key={background.id}
                    className="relative group cursor-pointer"
                    onClick={() => handleSelectBackground(background)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg">
                      <img
                        src={background.src.large}
                        alt={background.alt || 'Background image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedBackground === background.src.large && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {/* Download Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={downloadingId === background.id}
                      className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadBackground(background)
                      }}
                    >
                      {downloadingId === background.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && backgrounds.length > 0 && (
              <div className="mt-4 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      {t('upload.editor.loading')}
                    </>
                  ) : (
                    t('upload.editor.loadMore')
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedBackground ? '背景已选择' : t('upload.editor.selectBackground')}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-4 py-2 text-sm"
                >
                  取消
                </Button>
                <Button
                  onClick={handleApplyBackground}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                >
                  完成
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 弹窗模式
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('upload.editor.selectBackground')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t('upload.editor.pexelsDescription')}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('upload.editor.searchBackground')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('upload.editor.loading')}
                  </>
                ) : (
                  t('upload.editor.searchBackground')
                )}
              </Button>
            </div>
                         
             {/* 热门搜索标签已删除 */}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Download Status Message */}
          {downloadStatus && (
            <div className={`p-4 border ${
              downloadStatus.success 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <p className={`text-sm ${
                downloadStatus.success 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {downloadStatus.message}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading && backgrounds.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-600 dark:text-gray-400">{t('upload.editor.loading')}</span>
              </div>
            ) : backgrounds.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                {error ? t('upload.editor.noResults') : t('upload.editor.searchForBackgrounds')}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {backgrounds.map((background) => (
                  <div
                    key={background.id}
                    className="relative group cursor-pointer"
                    onClick={() => handleSelectBackground(background)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-200">
                      <img
                        src={background.src.medium}
                        alt={background.alt || 'Background image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedBackground === background.src.large && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    {/* Download Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={downloadingId === background.id}
                      className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 w-6 h-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadBackground(background)
                      }}
                    >
                      {downloadingId === background.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {hasMore && backgrounds.length > 0 && (
              <div className="mt-6 text-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  variant="outline"
                  className="px-6 py-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('upload.editor.loading')}
                    </>
                  ) : (
                    t('upload.editor.loadMore')
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedBackground ? '背景已选择' : t('upload.editor.selectBackground')}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="px-6 py-2"
                >
                  取消
                </Button>
                <Button
                  onClick={handleApplyBackground}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  完成
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 