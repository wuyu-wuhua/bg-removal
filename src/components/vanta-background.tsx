'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    VANTA?: {
      HALO: (config: any) => any
    }
  }
}

interface VantaBackgroundProps {
  children: React.ReactNode
  className?: string
  theme?: 'light' | 'dark'
}

export function VantaBackground({ children, className = '', theme = 'dark' }: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<any>(null)

  useEffect(() => {
    if (!vantaRef.current) return

    // 动态加载Vanta.js脚本
    const loadVantaScripts = async () => {
      // 检查是否已经加载
      if (!(window as any).VANTA?.HALO) {
        // 加载Three.js
        const threeScript = document.createElement('script')
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js'
        threeScript.async = true
        
        // 加载Vanta.js
        const vantaScript = document.createElement('script')
        vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js'
        vantaScript.async = true

        // 等待脚本加载完成
        await new Promise<void>((resolve) => {
          threeScript.onload = () => {
            document.head.appendChild(vantaScript)
            vantaScript.onload = () => resolve()
          }
          document.head.appendChild(threeScript)
        })
      }

      // 确保脚本已加载后再初始化
      setTimeout(() => {
        if ((window as any).VANTA?.HALO && vantaRef.current) {
          // 如果已有效果，先销毁
          if (effectRef.current && effectRef.current.destroy) {
            effectRef.current.destroy()
          }
          
          console.log('Initializing Vanta.js with theme:', theme)
          
          effectRef.current = (window as any).VANTA.HALO({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: theme === 'light' ? 0xe3e3e3 : 0x0a0a0a,
            baseColor: theme === 'light' ? 0x0ea5e9 : 0x3b82f6,
            amplitudeFactor: theme === 'light' ? 4.0 : 2.0,
            sizeFactor: theme === 'light' ? 2.5 : 1.5,
            speed: theme === 'light' ? 0.3 : 0.8,
            xOffset: 0.0,
            yOffset: 0.0
          })
          
          console.log('Vanta.js initialized successfully')
        } else {
          console.log('Vanta.js not available or element not found')
        }
      }, 100)
    }

    loadVantaScripts()

    // 清理函数
    return () => {
      if (effectRef.current && effectRef.current.destroy) {
        effectRef.current.destroy()
      }
    }
  }, [theme])

  // 额外的useEffect来处理DOM元素变化
  useEffect(() => {
    if (!vantaRef.current || !(window as any).VANTA?.HALO) return

    // 延迟重新初始化，确保DOM完全更新
    const timer = setTimeout(() => {
      if (effectRef.current && effectRef.current.destroy) {
        effectRef.current.destroy()
      }
      
      if (vantaRef.current) {
                  effectRef.current = (window as any).VANTA.HALO({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            backgroundColor: theme === 'light' ? 0xe3e3e3 : 0x0a0a0a,
            baseColor: theme === 'light' ? 0x0ea5e9 : 0x3b82f6,
            amplitudeFactor: theme === 'light' ? 4.0 : 2.0,
            sizeFactor: theme === 'light' ? 2.5 : 1.5,
            speed: theme === 'light' ? 0.3 : 0.8,
            xOffset: 0.0,
            yOffset: 0.0
          })
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [theme])

  return (
    <div ref={vantaRef} className={`w-full h-full ${className}`}>
      {children}
    </div>
  )
} 