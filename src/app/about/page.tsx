'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Zap, 
  Shield, 
  Globe, 
  Star,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Clock,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import { useLanguage } from '@/contexts/language-context'
import SEOHead from '@/components/seo-head'
import StructuredData from '@/components/structured-data'

export default function AboutPage() {
  const { t } = useLanguage()
  const [helpOpen, setHelpOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

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
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-500">
      <SEOHead 
        pageType="about"
        title="About Remover Fundo - Professional AI Image Processing Platform"
        description="Learn about Remover Fundo mission and vision. Remover Fundo is committed to providing professional, efficient, and user-friendly image processing solutions through advanced AI technology."
        keywords="Remover Fundo, about, mission, vision, AI image processing, background removal, company story"
      />
      <StructuredData type="organization" />
      <Navbar theme={theme} onThemeToggle={toggleTheme} currentPage="about" />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-start mb-8">
              <Link href="/" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105">
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('about.backToHome')}
              </Link>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
                <Sparkles className="h-4 w-4 mr-2" />
                {t('about.badge')}
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                {t('about.title')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                {t('about.description')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('about.heroStats.users')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Globe className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('about.heroStats.countries')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Star className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('about.heroStats.satisfaction')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-2xl shadow-2xl">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t('about.mission.title')}</h2>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {t('about.mission.description')}
                  </p>
                  <ul className="space-y-4">
                    {t('about.mission.features').map((feature: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-600 dark:text-gray-300 group">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-1 rounded-2xl shadow-2xl">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl">
                  <div className="flex items-center mb-8">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl mr-4">
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{t('about.vision.title')}</h2>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    {t('about.vision.description')}
                  </p>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('about.vision.coreValues.title')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center group">
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                          <Heart className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('about.vision.coreValues.userFirst')}</span>
                      </div>
                      <div className="flex items-center group">
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                          <Zap className="h-5 w-5 text-yellow-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('about.vision.coreValues.innovation')}</span>
                      </div>
                      <div className="flex items-center group">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('about.vision.coreValues.security')}</span>
                      </div>
                      <div className="flex items-center group">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3 group-hover:scale-110 transition-transform">
                          <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t('about.vision.coreValues.globalService')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              <Clock className="h-4 w-4 mr-2" />
              发展历程
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">{t('about.story.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('about.story.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(t('about.story.timeline') as any[]).map((timeline, index) => (
              <div key={index} className={`transition-all duration-1000 delay-${(index + 1) * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="group bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 overflow-hidden">
                  <div className={`bg-gradient-to-br ${index === 0 ? 'from-blue-600 to-purple-600' : index === 1 ? 'from-purple-600 to-pink-600' : 'from-green-600 to-blue-600'} p-8 text-center`}>
                    <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-bold text-white">{timeline.year}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{timeline.title}</h3>
                    <p className={`${index === 0 ? 'text-blue-100' : index === 1 ? 'text-purple-100' : 'text-green-100'}`}>
                      {timeline.description}
                    </p>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      {timeline.items.map((item: string, itemIndex: number) => (
                        <div key={itemIndex} className="flex items-center">
                          <div className={`w-2 h-2 ${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-purple-600' : 'bg-green-600'} rounded-full mr-3`}></div>
                          <span className="text-gray-600 dark:text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              <Users className="h-4 w-4 mr-2" />
              团队介绍
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-purple-800 dark:from-white dark:to-purple-200 bg-clip-text text-transparent">{t('about.team.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('about.team.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(t('about.team.departments') as any[]).map((department, index) => (
              <div key={index} className={`transition-all duration-1000 delay-${(index + 1) * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="group bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 text-center overflow-hidden">
                  <div className={`bg-gradient-to-br ${index === 0 ? 'from-blue-400 to-purple-500' : index === 1 ? 'from-green-400 to-blue-500' : index === 2 ? 'from-purple-400 to-pink-500' : 'from-orange-400 to-red-500'} p-8`}>
                    <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {index === 0 ? <Users className="h-12 w-12 text-white" /> : 
                       index === 1 ? <Star className="h-12 w-12 text-white" /> : 
                       index === 2 ? <Award className="h-12 w-12 text-white" /> : 
                       <TrendingUp className="h-12 w-12 text-white" />}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{department.title}</h3>
                    <p className={`${index === 0 ? 'text-blue-100' : index === 1 ? 'text-green-100' : index === 2 ? 'text-purple-100' : 'text-orange-100'} text-sm`}>{department.subtitle}</p>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {department.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              <Eye className="h-4 w-4 mr-2" />
              数据见证
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">{t('about.stats.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('about.stats.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {(t('about.stats.cards') as any[]).map((card, index) => (
              <div key={index} className={`transition-all duration-1000 delay-${(index + 1) * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <Card className="group bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 p-8 text-center">
                  <div className={`bg-gradient-to-br ${index === 0 ? 'from-blue-600 to-purple-600' : index === 1 ? 'from-purple-600 to-pink-600' : index === 2 ? 'from-green-600 to-blue-600' : 'from-orange-600 to-red-600'} p-6 rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    <div className="text-4xl font-bold text-white mb-2">{card.value}</div>
                    <div className={`${index === 0 ? 'text-blue-100' : index === 1 ? 'text-purple-100' : index === 2 ? 'text-green-100' : 'text-orange-100'}`}>{card.label}</div>
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mb-2">{card.description}</div>
                  {card.trend && (
                    <div className="text-green-600 dark:text-green-400 text-sm flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {card.trend}
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-5xl font-bold text-white mb-8">{t('about.cta.title')}</h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t('about.cta.startUsing')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                {t('about.cta.contactUs')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer onContactClick={() => setHelpOpen(true)} />
      <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
} 