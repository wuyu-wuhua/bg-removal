'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Mail, Phone, Headphones } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface HelpWidgetProps {
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

export default function HelpWidget({ isOpen: externalIsOpen, onOpenChange }: HelpWidgetProps) {
  const { t } = useLanguage()
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isInitialized, setIsInitialized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  // 初始化位置到右侧中间，使用 localStorage 保存位置状态
  useEffect(() => {
    const updatePosition = () => {
      // 尝试从 localStorage 获取保存的位置
      const savedPosition = localStorage.getItem('help-widget-position')
      let initialPosition = { x: 0, y: 0 }
      
      if (savedPosition) {
        try {
          const parsed = JSON.parse(savedPosition)
          // 验证保存的位置是否在当前窗口范围内
          if (parsed.x >= 0 && parsed.y >= 0 && 
              parsed.x <= window.innerWidth - 60 && 
              parsed.y <= window.innerHeight - 60) {
            initialPosition = parsed
          }
        } catch (e) {
          console.warn('Failed to parse saved position:', e)
        }
      }
      
      // 如果没有保存的位置或位置无效，使用默认位置
      if (initialPosition.x === 0 && initialPosition.y === 0) {
        initialPosition = { 
          x: window.innerWidth - 80, 
          y: window.innerHeight / 2 - 24 
        }
      }
      
      // 直接设置位置，不使用动画
      setPosition(initialPosition)
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
      setIsInitialized(true)
      
      // 延迟显示，确保位置已经设置完成
      setTimeout(() => {
        setIsVisible(true)
      }, 50)
    }
    
    updatePosition()
    window.addEventListener('resize', updatePosition)
    
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

  // 保存位置到 localStorage
  useEffect(() => {
    if (isInitialized && position.x > 0 && position.y > 0) {
      localStorage.setItem('help-widget-position', JSON.stringify(position))
    }
  }, [position, isInitialized])

  // 使用外部控制或内部状态
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

  // 暴露打开方法给父组件
  const openModal = () => {
    if (externalIsOpen !== undefined) {
      onOpenChange?.(true)
    } else {
      setInternalIsOpen(true)
    }
  }

  const closeModal = () => {
    if (externalIsOpen !== undefined) {
      onOpenChange?.(false)
    } else {
      setInternalIsOpen(false)
    }
  }

  // 处理拖拽开始（鼠标和触摸）
  const handleDragStart = (clientX: number, clientY: number) => {
    if (isOpen) return // 如果模态框打开，不允许拖拽
    
    const rect = widgetRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const touch = e.touches[0]
    if (touch) {
      handleDragStart(touch.clientX, touch.clientY)
    }
  }

  // 处理拖拽移动
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging) return

      const newX = clientX - dragOffset.x
      const newY = clientY - dragOffset.y

      // 限制在视窗范围内
      const maxX = window.innerWidth - 60
      const maxY = window.innerHeight - 60

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        handleMove(touch.clientX, touch.clientY)
      }
    }

    const handleDragEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleDragEnd)
      document.addEventListener('touchcancel', handleDragEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleDragEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleDragEnd)
      document.removeEventListener('touchcancel', handleDragEnd)
    }
  }, [isDragging, dragOffset])

  // 处理点击展开
  const handleClick = () => {
    if (!isDragging) {
      openModal()
    }
  }

  // 处理邮箱点击
  const handleEmailClick = () => {
    window.open('https://mail.google.com/mail/u/1/#inbox?compose=new', '_blank')
  }

  // 处理电话点击
  const handlePhoneClick = () => {
    window.open('tel:+02362872229', '_blank')
  }

  return (
    <>
      {/* 帮助小球 */}
      <div
        ref={widgetRef}
        className={`fixed z-50 cursor-pointer ${
          isDragging ? 'scale-110' : 'hover:scale-110'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isDragging ? 'scale(1.1)' : undefined,
          touchAction: 'none',
          // 只有在完全初始化后才显示，避免任何动画效果
          opacity: isVisible ? 1 : 0,
          // 移除所有过渡动画，确保位置立即生效
          transition: 'none'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={(e) => e.preventDefault()}
        onClick={handleClick}
      >
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
          <Headphones className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
      </div>

      {/* 帮助模态框 */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* 模态框内容 - 在小球左侧展开 */}
          <div 
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-80 max-w-[90vw]"
            style={{
              left: `${position.x - 320}px`,
              top: `${Math.max(20, position.y - 150)}px`,
              cursor: 'default'
            }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('help.contactSupport.title')}</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {t('help.contactSupport.description')}
              </p>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                <div className="flex items-center mb-2">
                  <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">{t('help.contactSupport.methods.0.title')}</span>
                </div>
                <button 
                  onClick={handleEmailClick}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  q9425916@gmail.com
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('help.contactSupport.methods.0.description')}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center mb-2">
                  <Phone className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                  <span className="font-medium text-gray-900 dark:text-white">{t('help.contactSupport.methods.1.title')}</span>
                </div>
                <button 
                  onClick={handlePhoneClick}
                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium transition-colors"
                >
                  +023 6287 2229
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('help.contactSupport.methods.1.description')}</p>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                {t('help.contactSupport.subtitle')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 