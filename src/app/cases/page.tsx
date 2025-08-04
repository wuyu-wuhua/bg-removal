'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  ArrowLeft,
  Eye,
  Download,
  Star,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImageComparisonSlider } from '@/components/image-comparison-slider'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'

export default function CasesPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [helpOpen, setHelpOpen] = useState(false)
  const [sliderPositions, setSliderPositions] = useState<{ [key: number]: number }>({})
  const { t } = useLanguage()
  const { user } = useAuth()

  // 主题切换功能
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  // 初始化主题
  useEffect(() => {
    const hasThemeClass = document.documentElement.classList.contains('dark') || 
                         document.documentElement.classList.contains('light');
    
    if (!hasThemeClass) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
      setTheme(initialTheme)
      document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    } else {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    }
  }, [])

  // 处理开始使用按钮点击
  const handleStartUsing = () => {
    if (user) {
      window.location.href = '/upload'
    } else {
      window.location.href = '/login'
    }
  }

  // 处理滑块位置变化
  const handleSliderPositionChange = (caseId: number, position: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [caseId]: position
    }))
  }

  // 处理按钮点击事件
  const handleViewResult = (caseId: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [caseId]: 0 // 滑块移到最左侧，显示结果图
    }))
  }

  const handleCompare = (caseId: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [caseId]: 50 // 滑块移到中间，显示对比
    }))
  }

  const handleViewOriginal = (caseId: number) => {
    setSliderPositions(prev => ({
      ...prev,
      [caseId]: 100 // 滑块移到最右侧，显示原图
    }))
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar currentPage="cases" theme={theme} onThemeToggle={toggleTheme} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background dark:via-background dark:to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6 flex justify-center">
              <span className="inline-flex items-center justify-center border border-transparent focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0 bg-blue-600 dark:bg-blue-500 text-white rounded-md h-6 min-w-6 gap-1.5 [&_svg]:size-3.5 px-4 py-2 text-sm font-medium">
                <Sparkles className="mr-2 h-4 w-4" />
                {t('cases.title')}
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:text-6xl xl:text-7xl">
              {t('cases.subtitle')}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8">
              {t('cases.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                onClick={handleStartUsing}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold"
              >
                {t('common.startUsing')} →
              </Button>
              <Link href="/pricing">
                <Button 
                  variant="outline"
                  className="px-8 py-3 text-base font-semibold bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  {t('common.viewPricing')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 p-8 text-center hover:bg-white dark:hover:bg-gray-800/70 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">12,500+</div>
              <div className="text-gray-600 dark:text-gray-400">{t('cases.stats.processedImages')}</div>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 p-8 text-center hover:bg-white dark:hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">2.1s</div>
              <div className="text-gray-600 dark:text-gray-400">{t('cases.stats.avgProcessingTime')}</div>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 p-8 text-center hover:bg-white dark:hover:bg-gray-800/70 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">91%</div>
              <div className="text-gray-600 dark:text-gray-400">{t('cases.stats.qualityImprovement')}</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {(t('cases.cases') as any[]).map((caseItem) => (
              <Card key={caseItem.id} className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800/70 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  {/* Image Comparison */}
                  <div className="mb-8">
                    <ImageComparisonSlider 
                      originalImage={caseItem.id === 1 ? '/images/外国男人.jpg' : 
                                   caseItem.id === 2 ? '/images/猫猫.jpg' :
                                   caseItem.id === 3 ? '/images/礼物.jpg' :
                                   caseItem.id === 4 ? '/images/车.jpg' :
                                   caseItem.id === 5 ? '/images/苹果.jpg' :
                                   '/images/高楼.jpg'}
                      processedImage={caseItem.id === 1 ? '/images/外国男人后.jpg' : 
                                    caseItem.id === 2 ? '/images/猫猫后.jpg' :
                                    caseItem.id === 3 ? '/images/礼物后.jpg' :
                                    caseItem.id === 4 ? '/images/车后.jpg' :
                                    caseItem.id === 5 ? '/images/苹果后.jpg' :
                                    '/images/高楼后.jpg'}
                      showPercentage={true}
                      transparentBackground="checkerboard"
                      sliderPosition={sliderPositions[caseItem.id]}
                      onSliderPositionChange={(position) => handleSliderPositionChange(caseItem.id, position)}
                    />
                  </div>

                  {/* Case Info */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                        {caseItem.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {caseItem.rating}
                        <span className="mx-2">•</span>
                        <Eye className="h-4 w-4 mr-1" />
                        {caseItem.views}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      {caseItem.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-base mb-6">
                      {caseItem.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                      onClick={() => handleViewResult(caseItem.id)}
                    >
                      查看结果
                    </Button>
                    <Button 
                      size="lg"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleCompare(caseItem.id)}
                    >
                      对比
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="flex-1 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                      onClick={() => handleViewOriginal(caseItem.id)}
                    >
                      查看原图
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cases.cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('cases.cta.description')}
            </p>
            <div className="flex flex-row gap-4 justify-center">
              <Button 
                onClick={handleStartUsing}
                className="flex-1 sm:flex-none sm:w-auto bg-white dark:bg-gray-900 text-blue-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 border-0 dark:border border-white dark:border-white px-4 sm:px-8 py-3 text-base font-semibold"
              >
                {t('cases.cta.startUsing')}
              </Button>
              <Link href="/pricing" className="flex-1 sm:flex-none sm:w-auto">
                <Button 
                  variant="outline"
                  className="flex-1 sm:w-auto border-white text-blue-600 dark:text-white hover:bg-white/90 hover:text-blue-600 hover:border-white/80 px-8 py-3 text-base font-semibold transition-all duration-200"
                >
                  {t('cases.cta.viewPricing')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer onContactClick={() => setHelpOpen(true)} />
      <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
} 