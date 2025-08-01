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
  const widgetRef = useRef<HTMLDivElement>(null)

  // 初始化位置到右侧中间
  useEffect(() => {
    const updatePosition = () => {
      setPosition({ 
        x: window.innerWidth - 80, 
        y: window.innerHeight / 2 - 24 
      })
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    updatePosition()
    window.addEventListener('resize', updatePosition)
    
    return () => window.removeEventListener('resize', updatePosition)
  }, [])

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

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen) return // 如果模态框打开，不允许拖拽
    
    const rect = widgetRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
      setIsDragging(true)
    }
  }

  // 处理拖拽移动
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // 限制在视窗范围内
      const maxX = window.innerWidth - 60
      const maxY = window.innerHeight - 60

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
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
        className={`fixed z-50 cursor-pointer transition-all duration-300 ${
          isDragging ? 'scale-110' : 'hover:scale-110'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: isDragging ? 'scale(1.1)' : undefined
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300">
          <Headphones className="w-5 h-5 text-white" />
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