'use client'

import { useEffect, useRef, useCallback } from 'react'

interface VantaDotsBackgroundProps {
  className?: string
  children?: React.ReactNode
  theme?: 'light' | 'dark'
}

export function VantaDotsBackground({ className = '', children, theme = 'dark' }: VantaDotsBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffectRef = useRef<any>(null)
  const scriptsLoadedRef = useRef(false)
  const currentThemeRef = useRef(theme)

  // 清理Vanta效果的函数
  const cleanupVanta = useCallback(() => {
    if (vantaEffectRef.current) {
      try {
        vantaEffectRef.current.destroy()
        console.log('Vanta effect destroyed')
      } catch (error) {
        console.warn('Error destroying Vanta effect:', error)
      }
      vantaEffectRef.current = null
    }
  }, [])

  // 初始化Vanta效果的函数
  const initVanta = useCallback(async () => {
    console.log('Initializing Vanta with theme:', theme, 'Current theme ref:', currentThemeRef.current)
    
    try {
      // 如果脚本还没加载，先加载脚本
      if (!scriptsLoadedRef.current) {
        console.log('Loading Vanta scripts...')
        
        // 加载three.js
        if (!(window as any).THREE) {
          const threeScript = document.createElement('script')
          threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
          document.head.appendChild(threeScript)
          await new Promise((resolve, reject) => {
            threeScript.onload = resolve
            threeScript.onerror = reject
          })
        }

        // 加载vanta.dots.js
        if (!(window as any).VANTA) {
          const vantaScript = document.createElement('script')
          vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js'
          document.head.appendChild(vantaScript)
          await new Promise((resolve, reject) => {
            vantaScript.onload = resolve
            vantaScript.onerror = reject
          })
        }
        
        scriptsLoadedRef.current = true
        console.log('Vanta scripts loaded successfully')
      }

      // 等待VANTA对象完全加载
      let retries = 0
      const maxRetries = 30
      
      const waitForVanta = () => {
        if ((window as any).VANTA && (window as any).VANTA.DOTS && vantaRef.current) {
          console.log('Creating Vanta effect with theme:', theme)
          
          // 确保先清理旧效果
          if (vantaEffectRef.current) {
            try {
              vantaEffectRef.current.destroy()
            } catch (error) {
              console.warn('Error destroying previous Vanta effect:', error)
            }
            vantaEffectRef.current = null
          }
          
          // 创建新的Vanta效果
          vantaEffectRef.current = (window as any).VANTA.DOTS({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: theme === 'light' ? 0x3b82f6 : 0x60a5fa,
            color2: theme === 'light' ? 0x8b5cf6 : 0xa78bfa,
            backgroundColor: theme === 'light' ? 0xf3f4f6 : 0x0a0a0a, // 浅色模式使用 gray-100，深色模式使用深黑色
            size: theme === 'light' ? 3.00 : 4.00,
            spacing: theme === 'light' ? 35.00 : 30.00,
            showLines: true
          })
          
          currentThemeRef.current = theme
          console.log('Vanta effect created successfully with theme:', theme)
        } else if (retries < maxRetries) {
          retries++
          setTimeout(waitForVanta, 100) // 增加等待时间
        } else {
          console.warn('Vanta.js failed to load after maximum retries')
        }
      }

      waitForVanta()
    } catch (error) {
      console.error('Failed to initialize Vanta.js:', error)
    }
  }, [theme])

  useEffect(() => {
    console.log('Theme changed to:', theme, 'Previous theme:', currentThemeRef.current)
    
      // 立即清理旧效果
      cleanupVanta()
      
    // 强制重新初始化，使用更长的延迟确保DOM完全更新
      const timer = setTimeout(() => {
      console.log('Reinitializing Vanta after theme change to:', theme)
        initVanta()
    }, 200)

      return () => {
        clearTimeout(timer)
        cleanupVanta()
    }
  }, [theme, cleanupVanta, initVanta])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupVanta()
    }
  }, [cleanupVanta])

  // 初始化时立即创建效果
  useEffect(() => {
    console.log('Component mounted, initializing Vanta with theme:', theme)
    const timer = setTimeout(() => {
      initVanta()
    }, 100)
    
    return () => clearTimeout(timer)
  }, []) // 只在组件挂载时执行一次

  return (
    <div ref={vantaRef} className={className}>
      {children}
    </div>
  )
} 