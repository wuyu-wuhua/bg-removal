'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const vantaRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()
  const { signInWithGoogle, user } = useAuth()
  const router = useRouter()

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

  useEffect(() => {
    // 动态加载Vanta.js脚本
    const loadVantaScripts = async () => {
      try {
        // 加载p5.js
        if (!(window as any).p5) {
          const p5Script = document.createElement('script')
          p5Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js'
          document.head.appendChild(p5Script)
          await new Promise((resolve, reject) => {
            p5Script.onload = resolve
            p5Script.onerror = reject
          })
        }

        // 加载vanta.topology.js
        if (!(window as any).VANTA) {
          const vantaScript = document.createElement('script')
          vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.topology.min.js'
          document.head.appendChild(vantaScript)
          await new Promise((resolve, reject) => {
            vantaScript.onload = resolve
            vantaScript.onerror = reject
          })
        }

        // 等待一小段时间确保脚本完全加载
        await new Promise(resolve => setTimeout(resolve, 100))

        // 清理之前的Vanta效果
        if (vantaRef.current && (window as any).VANTA) {
          const existingEffect = (vantaRef.current as any).vantaEffect
          if (existingEffect && existingEffect.destroy) {
            existingEffect.destroy()
          }
        }

        // 初始化Vanta背景
        if ((window as any).VANTA && vantaRef.current) {
          console.log('Initializing Vanta background...')
          
          const vantaEffect = (window as any).VANTA.TOPOLOGY({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: theme === 'dark' ? 0x5e97c8 : 0x556c91,
            backgroundColor: theme === 'dark' ? 0x0a0a0a : 0xd7d7d7
          })

          // 保存实例引用以便后续清理
          ;(vantaRef.current as any).vantaEffect = vantaEffect
          console.log('Vanta background initialized successfully')
        }
      } catch (error) {
        console.error('Error loading Vanta.js:', error)
      }
    }

    // 确保DOM元素已经渲染
    if (vantaRef.current) {
      loadVantaScripts()
    } else {
      // 如果DOM元素还没准备好，等待一下再加载
      const timer = setTimeout(() => {
        loadVantaScripts()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [theme]) // 添加theme作为依赖项，当主题切换时重新初始化背景

  // 额外的useEffect确保在组件挂载后立即初始化
  useEffect(() => {
    const initializeVanta = () => {
      if (vantaRef.current && (window as any).VANTA && !(vantaRef.current as any).vantaEffect) {
        console.log('Force initializing Vanta background...')
        
        const vantaEffect = (window as any).VANTA.TOPOLOGY({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: theme === 'dark' ? 0x5e97c8 : 0x556c91,
          backgroundColor: theme === 'dark' ? 0x0a0a0a : 0xd7d7d7
        })

        ;(vantaRef.current as any).vantaEffect = vantaEffect
        console.log('Vanta background force initialized')
      }
    }

    // 延迟一点时间确保所有脚本都已加载
    const timer = setTimeout(initializeVanta, 500)
    
    return () => clearTimeout(timer)
  }, [theme])

  // 如果用户已登录，重定向到个人空间
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google login...')
    setIsLoading(true)
      await signInWithGoogle()
      console.log('Google login initiated successfully')
    } catch (error) {
      console.error('Login error:', error)
    setIsLoading(false)
    }
  }

    return (
    <div className="min-h-screen relative flex flex-col">
      {/* Vanta背景 */}
      <div ref={vantaRef} className="absolute inset-0 z-0"></div>

      <Navbar theme={theme} onThemeToggle={toggleTheme} currentPage="login" />

      <main className="flex-1 flex items-center justify-center px-4 py-32 relative z-10">
        <div className="w-full max-w-lg">
          {/* 返回首页按钮 */}
          <div className="flex items-center justify-start mb-8">
            <Link href="/" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('common.backToHome')}
            </Link>
          </div>

          {/* 登录卡片 */}
          <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardContent className="p-10">
              {/* 标题区域 */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#4285F4"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('login.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('login.subtitle')}
                </p>
              </div>

              {/* 登录按钮 */}
              <div className="space-y-6">
                <Button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                >
                  <svg className="h-5 w-5 mr-3 text-red-500 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#4285F4"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {isLoading ? '登录中...' : t('login.googleLogin')}
                </Button>
              </div>

              {/* 底部说明 */}
              <div className="mt-10 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('login.terms')}{' '}
                  <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {t('footer.terms')}
                  </Link>
                  {' '}和{' '}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {t('footer.privacy')}
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <div className="relative z-10 mt-auto pt-16">
        <Footer onContactClick={() => setHelpOpen(true)} />
      </div>
      <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
} 