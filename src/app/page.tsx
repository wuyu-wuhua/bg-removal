'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'
import { useTheme } from '@/hooks/useTheme'
import { 
  Zap, 
  Image as ImageIcon, 
  Sparkles, 
  Star, 
  ArrowRight, 
  Check, 
  TrendingUp,
  Upload,
  Download,
  Sun,
  Moon,
  Menu,
  Bell,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UploadZone } from '@/components/upload-zone'
import { ImageResult } from '@/components/image-result'
import { TestimonialsSection } from '@/components/testimonials'
import { VantaBackground } from '@/components/vanta-background'
import { VantaDotsBackground } from '@/components/vanta-dots-background'
import { ImageComparisonSlider } from '@/components/image-comparison-slider'
import { ProcessedImage } from '@/types'
import { generateId, isValidImageFile } from '@/lib/utils'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'

export default function HomePage() {
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [showComparison, setShowComparison] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  // 处理免费开始使用按钮点击
  const handleStartUsing = () => {
    if (user) {
      // 已登录，跳转到功能页面
      window.location.href = '/upload'
    } else {
      // 未登录，跳转到登录页面
      window.location.href = '/login'
    }
  }

  // 处理查看案例按钮点击
  const handleViewCases = () => {
    window.location.href = '/cases'
  }

  const handleFileSelect = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (isValidImageFile(file)) {
        const id = generateId()
        const originalUrl = URL.createObjectURL(file)
        
        const newImage: ProcessedImage = {
          id,
          originalFile: file,
          originalUrl,
          processedUrl: '',
          name: file.name,
          processing: true,
          progress: 0
        }

        setImages(prev => [...prev, newImage])

        // 模拟处理进度
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 20
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setImages(prev => prev.map(img => 
              img.id === id 
                ? { ...img, processing: false, processedUrl: originalUrl, progress: 100 }
                : img
            ))
          } else {
            setImages(prev => prev.map(img => 
              img.id === id 
                ? { ...img, progress }
                : img
            ))
          }
        }, 200)
      }
    })
  }

  const downloadImage = (image: ProcessedImage) => {
    const link = document.createElement('a')
    link.href = image.processedUrl
    link.download = `cutout-${image.name}`
    link.click()
  }

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const toggleComparison = (id: string) => {
    setShowComparison(showComparison === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar currentPage="home" theme={theme} onThemeToggle={toggleTheme} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-background dark:via-background dark:to-muted/20 group">
        <div className="relative size-full overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-black dark:via-gray-900 dark:to-zinc-900 h-[calc(100vh-4rem)] transition-all duration-700 group-hover:scale-105" data-slot="hover-background" style={{backgroundSize: '200% 200%', backgroundPosition: '0% 50%', transform: 'none'}}>

          
          {/* Animated background elements */}
          <div className="absolute border border-white/10 backdrop-blur-sm bg-emerald-500/30 rounded-full animate-float transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '77.1326px', left: '6.53944%', top: '31.3516%', width: '77.1326px', opacity: 0.4, transform: 'translateX(0.564137px) translateY(1.05776px) scale(0.641744) rotate(330.526deg)'}}></div>
          <div className="absolute border border-white/10 backdrop-blur-sm bg-teal-500/30 rotate-45 rounded-lg animate-float-delay-1 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '48.4683px', left: '63.636%', top: '38.795%', width: '48.4683px', opacity: 0.4, transform: 'translateX(1.05615px) translateY(1.98028px) scale(0.603535) rotate(179.279deg)'}}></div>
          <div className="absolute border border-white/10 backdrop-blur-sm bg-green-500/30 rotate-45 rounded-lg animate-float-delay-2 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '46.3297px', left: '81.041%', top: '74.0178%', width: '46.3297px', opacity: 0.4, transform: 'translateX(-0.0798265px) translateY(-0.149675px) scale(0.709873) rotate(333.989deg)'}}></div>
          <div className="absolute border border-white/10 backdrop-blur-sm bg-lime-500/30 rounded-full animate-float-delay-3 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '53.8578px', left: '11.7323%', top: '53.9063%', width: '53.8578px', opacity: 0.4, transform: 'translateX(0.225479px) translateY(0.422773px) scale(0.605637) rotate(110.726deg)'}}></div>
          <div className="absolute border border-white/10 backdrop-blur-sm bg-cyan-500/30 rotate-45 rounded-lg animate-float transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '26.2149px', left: '10.3941%', top: '40.6509%', width: '26.2149px', opacity: 0.4, transform: 'translateX(7.69007px) translateY(14.4189px) scale(0.792252) rotate(174.889deg)'}}></div>
          <div className="absolute border border-white/10 backdrop-blur-sm bg-blue-500/30 rounded-full animate-float-delay-1 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '72.3636px', left: '11.3191%', top: '94.6583%', width: '72.3636px', opacity: 0.4, transform: 'translateX(5.32778px) translateY(9.98958px) scale(0.7361) rotate(333.279deg)'}}></div>
          <div className="absolute border border-white/10 backdrop-blur-sm bg-emerald-500/30 rotate-45 rounded-lg animate-float-delay-2 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '37.9333px', left: '27.3481%', top: '45.4026%', width: '37.9333px', opacity: 0.4, transform: 'translateX(-3.85647px) translateY(-7.23089px) scale(0.799141) rotate(239.151deg)'}}></div>
          <div className="absolute border border-white/10 backdrop-blur-sm bg-teal-500/30 rotate-45 rounded-lg animate-float-delay-3 transition-all duration-700 group-hover:scale-110 group-hover:opacity-70 group-hover:translate-y-[-10px]" style={{height: '71.1064px', left: '20.8792%', top: '82.4046%', width: '71.1064px', opacity: 0.4, transform: 'translateX(-7.13054px) translateY(-13.3698px) scale(0.778264) rotate(123.136deg)'}}></div>
          
          {/* Particle effects - always visible and animated */}
          <div className="absolute w-2 h-2 bg-white/20 rounded-full animate-particle-1" style={{left: '15%', top: '20%'}}></div>
          <div className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-particle-2" style={{left: '25%', top: '15%'}}></div>
          <div className="absolute w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-particle-3" style={{left: '35%', top: '25%'}}></div>
          <div className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-particle-4" style={{left: '45%', top: '10%'}}></div>
          <div className="absolute w-2 h-2 bg-cyan-400/40 rounded-full animate-particle-5" style={{left: '55%', top: '30%'}}></div>
          <div className="absolute w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-particle-6" style={{left: '65%', top: '20%'}}></div>
          <div className="absolute w-1 h-1 bg-yellow-400/40 rounded-full animate-particle-7" style={{left: '75%', top: '15%'}}></div>
          <div className="absolute w-2 h-2 bg-orange-400/30 rounded-full animate-particle-8" style={{left: '85%', top: '25%'}}></div>
          <div className="absolute w-1 h-1 bg-red-400/40 rounded-full animate-particle-9" style={{left: '10%', top: '35%'}}></div>
          <div className="absolute w-1.5 h-1.5 bg-indigo-400/30 rounded-full animate-particle-10" style={{left: '20%', top: '40%'}}></div>
          
          {/* Additional particles for more dynamic effect */}
          <div className="absolute w-1 h-1 bg-green-400/50 rounded-full animate-particle-11" style={{left: '30%', top: '60%'}}></div>
          <div className="absolute w-1.5 h-1.5 bg-teal-400/40 rounded-full animate-particle-12" style={{left: '40%', top: '70%'}}></div>
          <div className="absolute w-1 h-1 bg-violet-400/30 rounded-full animate-particle-13" style={{left: '50%', top: '50%'}}></div>
          <div className="absolute w-2 h-2 bg-rose-400/40 rounded-full animate-particle-14" style={{left: '60%', top: '80%'}}></div>
          <div className="absolute w-1 h-1 bg-sky-400/50 rounded-full animate-particle-15" style={{left: '70%', top: '65%'}}></div>
          
          <div className="relative z-10 size-full">
            <div className="flex h-full items-center justify-center">
              <div className="mx-auto max-w-4xl text-center transition-all duration-700 group-hover:scale-105">
                <div className="mb-8 flex justify-center">
                  <span className="inline-flex items-center justify-center border border-transparent focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0 bg-blue-600 dark:bg-blue-500 text-white rounded-md h-6 min-w-6 gap-1.5 [&_svg]:size-3.5 px-4 py-2 text-sm font-medium">
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('home.hero.badge')}
                  </span>
                </div>
                
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                  <span className="block">{t('home.hero.mainTitle')}</span>
                  <span className="block bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">{t('home.hero.subTitle')}</span>
                </h1>
                
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 sm:text-xl">
                  {t('home.hero.description')}
                </p>
                
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button 
              onClick={handleStartUsing}
                    className="group px-8 py-3 text-base font-semibold"
            >
                    {t('home.hero.ctaPrimary')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="outline" 
                    onClick={handleViewCases}
                    className="px-8 py-3 text-base font-semibold bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
            >
              {t('home.hero.ctaSecondary')}
            </Button>
          </div>
          
                                <div className="mt-12">
                  <p className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">{t('home.hero.features.title')}</p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                      {t('home.hero.features.trial')}
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                      {t('home.hero.features.formats')}
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                      {t('home.hero.features.algorithm')}
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                      {t('home.hero.features.batch')}
                    </div>
            </div>
            </div>
            </div>
            </div>
          </div>
        </div>
      </section>





      {/* Features Section */}
        <>
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.features.title')}</h2>
                <p className="text-xl text-blue-600 dark:text-blue-400 mb-2">{t('home.features.subtitle')}</p>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t('home.features.description')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800/70 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <CardContent className="p-6">
                    <div className="bg-blue-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600/30 group-hover:scale-110 transition-all duration-300 card-glow">
                      <Sparkles className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 card-hover-icon" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">{t('home.features.intelligentCutout.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.features.intelligentCutout.description')}</p>
                    <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-2">
                      {t('home.features.intelligentCutout.features').map((feature: string, index: number) => (
                        <li key={index} className="flex items-center group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                          <Check className="h-4 w-4 text-blue-400 mr-2 group-hover:text-blue-300 transition-colors duration-300" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-center bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <CardContent className="p-6">
                    <div className="bg-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-600/30 group-hover:scale-110 transition-all duration-300 card-glow">
                      <Star className="h-8 w-8 text-purple-400 group-hover:text-purple-300 transition-colors duration-300 card-hover-icon" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300">{t('home.features.imageEnhancement.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.features.imageEnhancement.description')}</p>
                    <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-2">
                      {t('home.features.imageEnhancement.features').map((feature: string, index: number) => (
                        <li key={index} className="flex items-center group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                          <Check className="h-4 w-4 text-purple-400 mr-2 group-hover:text-purple-300 transition-colors duration-300" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-center bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800/70 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <CardContent className="p-6">
                    <div className="bg-green-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600/30 group-hover:scale-110 transition-all duration-300 card-glow">
                      <Zap className="h-8 w-8 text-green-400 group-hover:text-green-300 transition-colors duration-300 card-hover-icon" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors duration-300">{t('home.features.batchProcessing.title')}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.features.batchProcessing.description')}</p>
                    <ul className="text-sm text-gray-500 dark:text-gray-500 space-y-2">
                      {t('home.features.batchProcessing.features').map((feature: string, index: number) => (
                        <li key={index} className="flex items-center group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                          <Check className="h-4 w-4 text-green-400 mr-2 group-hover:text-green-300 transition-colors duration-300" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Case Study Section */}
          <section className="py-24 px-2 sm:px-4 lg:px-6 bg-gray-100/50 dark:bg-gray-800/50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.caseStudy.title')}</h2>
                <p className="text-xl text-blue-600 dark:text-blue-400 mb-2">{t('home.caseStudy.subtitle')}</p>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t('home.caseStudy.description')}
                </p>
              </div>

              <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                <div className="w-full">
                  <ImageComparisonSlider 
                    originalImage="/images/外国女人.jpg"
                    processedImage="/images/外国女人后.jpg"
                    showPercentage={true}
                  />
                </div>
                <div className="w-full">
                  <ImageComparisonSlider 
                    originalImage="/images/鸟.jpg"
                    processedImage="/images/鸟后.jpg"
                    showPercentage={true}
                  />
                </div>
                <div className="w-full">
                  <ImageComparisonSlider 
                    originalImage="/images/饼干.jpg"
                    processedImage="/images/饼干后.jpg"
                    showPercentage={true}
                  />
                </div>
              </div>

              <div className="text-center">
                <Link href="/cases">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold">
                    {t('home.caseStudy.viewAll')} →
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.stats.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400">{t('home.stats.subtitle')}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 p-8 text-center hover:bg-white dark:hover:bg-gray-800/70 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">{t('home.stats.cards.0.value')}</div>
                  <div className="text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.stats.cards.0.title')}</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">{t('home.stats.cards.0.description')}</div>
                  <div className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center justify-center group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {t('home.stats.cards.0.trendValue')}
                  </div>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 p-8 text-center hover:bg-white dark:hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="text-gray-500 text-sm mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">{t('home.stats.cards.1.title')}</div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300">{t('home.stats.cards.1.value')}</div>
                  <div className="text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.stats.cards.1.subtitle')}</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">{t('home.stats.cards.1.description')}</div>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 p-8 text-center hover:bg-white dark:hover:bg-gray-800/70 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors duration-300">{t('home.stats.cards.2.value')}</div>
                  <div className="text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.stats.cards.2.title')}</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">{t('home.stats.cards.2.description')}</div>
                </Card>

                <Card className="bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 p-8 text-center hover:bg-white dark:hover:bg-gray-800/70 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors duration-300">{t('home.stats.cards.3.value')}</div>
                  <div className="text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.stats.cards.3.title')}</div>
                  <div className="text-sm text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">{t('home.stats.cards.3.description')}</div>
                  <div className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center justify-center group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {t('home.stats.cards.3.trendValue')}
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100/50 dark:bg-gray-800/50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('home.steps.title')}</h2>
                <p className="text-xl text-blue-600 dark:text-blue-400 mb-2">{t('home.steps.subtitle')}</p>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {t('home.steps.description')}
                </p>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
                {/* Step 1 */}
                <div className="bg-white/80 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-sm relative hover:bg-white dark:hover:bg-gray-800/90 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                      <span className="text-xl font-bold text-white">1</span>
                    </div>
                    <button className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105">
                      {t('home.steps.items.0.title')}
                    </button>
                  </div>
                  <div className="bg-blue-600/20 p-4 rounded-lg mb-4 group-hover:bg-blue-600/30 transition-all duration-300">
                    <Upload className="h-8 w-8 text-blue-400 mx-auto group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300">{t('home.steps.items.0.description')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.steps.items.0.description')}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {t('home.steps.items.0.features').map((feature: string, index: number) => (
                      <li key={index} className="group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">• {feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center">
                  <div className="w-8 h-0.5 bg-gray-400 dark:bg-gray-600 hover:bg-purple-400 transition-colors duration-300"></div>
                  <div className="w-0 h-0 border-l-4 border-l-gray-400 dark:border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1 hover:border-l-purple-400 transition-colors duration-300"></div>
                </div>

                {/* Step 2 */}
                <div className="bg-white/80 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-sm relative hover:bg-white dark:hover:bg-gray-800/90 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors duration-300">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <div className="bg-purple-600/20 p-4 rounded-lg mb-4 group-hover:bg-purple-600/30 transition-all duration-300">
                    <Zap className="h-8 w-8 text-purple-400 mx-auto group-hover:text-purple-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-300">{t('home.steps.items.1.description')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.steps.items.1.description')}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {t('home.steps.items.1.features').map((feature: string, index: number) => (
                      <li key={index} className="group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">• {feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center">
                  <div className="w-8 h-0.5 bg-gray-400 dark:bg-gray-600 hover:bg-green-400 transition-colors duration-300"></div>
                  <div className="w-0 h-0 border-l-4 border-l-gray-400 dark:border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1 hover:border-l-green-400 transition-colors duration-300"></div>
                </div>

                {/* Step 3 */}
                <div className="bg-white/80 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-sm relative hover:bg-white dark:hover:bg-gray-800/90 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors duration-300">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <div className="bg-green-600/20 p-4 rounded-lg mb-4 group-hover:bg-green-600/30 transition-all duration-300">
                    <Download className="h-8 w-8 text-green-400 mx-auto group-hover:text-green-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors duration-300">{t('home.steps.items.2.description')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.steps.items.2.description')}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {t('home.steps.items.2.features').map((feature: string, index: number) => (
                      <li key={index} className="group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">• {feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center">
                  <div className="w-8 h-0.5 bg-gray-400 dark:bg-gray-600 hover:bg-orange-400 transition-colors duration-300"></div>
                  <div className="w-0 h-0 border-l-4 border-l-gray-400 dark:border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1 hover:border-l-orange-400 transition-colors duration-300"></div>
                </div>

                {/* Step 4 */}
                <div className="bg-white/80 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl p-6 w-full max-w-sm relative hover:bg-white dark:hover:bg-gray-800/90 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300">
                      <span className="text-xl font-bold text-white">4</span>
                    </div>
                    <button className="bg-gray-200 dark:bg-gray-700 hover:bg-orange-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105">
                      {t('home.steps.items.3.title')}
                    </button>
                  </div>
                  <div className="bg-orange-600/20 p-4 rounded-lg mb-4 group-hover:bg-orange-600/30 transition-all duration-300">
                    <Check className="h-8 w-8 text-orange-400 mx-auto group-hover:text-orange-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors duration-300">{t('home.steps.items.3.description')}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">{t('home.steps.items.3.description')}</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {t('home.steps.items.3.features').map((feature: string, index: number) => (
                      <li key={index} className="group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <TestimonialsSection />

          {/* Modal Section */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8">
            <VantaDotsBackground className="absolute inset-0 rounded-2xl overflow-hidden" theme={theme === 'dark' ? 'dark' : 'light'}>
              <div className="absolute inset-0 bg-black/20 dark:bg-black/20"></div>
            </VantaDotsBackground>
            <div className="max-w-4xl mx-auto relative z-10">
              {/* Modal Overlay */}
              <div className="relative bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-md">
                {/* Top Badge */}
                <div className="flex justify-center mb-6">
                  <span className="inline-flex items-center justify-center bg-blue-100 dark:bg-gray-700/50 text-blue-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('common.startNow')}
                  </span>
                </div>

                {/* Main Content */}
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('home.hero.title')}
                  </h2>
                  <p className="text-xl text-blue-600 dark:text-blue-300 mb-6">
                    {t('home.hero.subtitle')}
                  </p>
                  <p className="text-gray-600 dark:text-gray-200 mb-8 max-w-2xl mx-auto text-lg">
                    {t('home.hero.description')}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button 
                      onClick={handleStartUsing}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {t('home.hero.ctaPrimary')}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = '/pricing'}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white px-8 py-4 text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      {t('common.viewPricing')}
                    </Button>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-300 dark:border-blue-400/30">
                      {t('common.freeTrial')}
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-300 dark:border-blue-400/30">
                      {t('common.noRegistration')}
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-300 dark:border-blue-400/30">
                      {t('common.instantProcessing')}
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium border border-blue-300 dark:border-blue-400/30">
                      {t('common.professionalQuality')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

                    <Footer onContactClick={() => setHelpOpen(true)} />
        </>
        <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
} 