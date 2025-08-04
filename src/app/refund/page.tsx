'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Shield,
  Sparkles,
  ArrowRight,
  DollarSign,
  RefreshCw,
  UserCheck,
  Zap,
  MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import { useLanguage } from '@/contexts/language-context'

export default function RefundPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-500">
      <Navbar theme={theme} onThemeToggle={toggleTheme} currentPage="refund" />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-orange-600/10 to-yellow-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">

            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
                <Shield className="h-4 w-4 mr-2" />
                {t('policies.refund.badge')}
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-red-800 to-orange-800 dark:from-white dark:via-red-200 dark:to-orange-200 bg-clip-text text-transparent">
                {t('policies.refund.title')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                {t('policies.refund.content')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Clock className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.refund.heroStats.days')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.refund.heroStats.fullRefund')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.refund.heroStats.fastProcess')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policy Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* General Policy */}
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.refund.overview.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-6 text-gray-600 dark:text-gray-300">
                      <p className="text-lg leading-relaxed">
                        {t('policies.refund.overview.description')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(t('policies.refund.overview.features') as any[]).map((feature, index) => (
                          <div key={index} className={`${index === 0 ? 'bg-green-50 dark:bg-green-900/20' : index === 1 ? 'bg-blue-50 dark:bg-blue-900/20' : index === 2 ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'} p-6 rounded-xl`}>
                            <div className="flex items-center mb-4">
                              {index === 0 ? <CheckCircle className="h-6 w-6 text-green-600 mr-3" /> : 
                               index === 1 ? <Clock className="h-6 w-6 text-blue-600 mr-3" /> : 
                               index === 2 ? <Shield className="h-6 w-6 text-purple-600 mr-3" /> : 
                               <UserCheck className="h-6 w-6 text-yellow-600 mr-3" />}
                              <span className="font-semibold text-gray-900 dark:text-white">{feature.title}</span>
                            </div>
                            <p className="text-sm">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Refund Conditions */}
              <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.refund.conditions.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          {t('policies.refund.conditions.description')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(t('policies.refund.conditions.eligible') as string[]).map((item, index) => (
                            <div key={index} className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg mr-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          </div>
                          {t('policies.refund.notEligibleTitle')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(t('policies.refund.conditions.notEligible') as string[]).map((item, index) => (
                            <div key={index} className="flex items-start p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Refund Process */}
              <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <RefreshCw className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.refund.process.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {(t('policies.refund.process.steps') as any[]).map((step, index) => (
                        <div key={index} className="text-center group">
                          <div className={`bg-gradient-to-br ${index === 0 ? 'from-blue-600 to-purple-600' : index === 1 ? 'from-purple-600 to-pink-600' : 'from-green-600 to-blue-600'} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                            <span className="text-2xl font-bold text-white">{index + 1}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <Mail className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('contact.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                      {t('contact.description')}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(t('contact.methods') as any[]).map((method, index) => (
                        <div key={index} className={`bg-gradient-to-r ${index === 0 ? 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : index === 1 ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'} p-6 rounded-xl`}>
                          <div className="flex items-center mb-4">
                            <div className={`${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-green-600' : 'bg-purple-600'} p-3 rounded-lg mr-4`}>
                              {index === 0 ? <Mail className="h-6 w-6 text-white" /> : 
                               index === 1 ? <Phone className="h-6 w-6 text-white" /> : 
                               <MessageCircle className="h-6 w-6 text-white" />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{method.title}</p>
                              <p className={`${index === 0 ? 'text-blue-600 dark:text-blue-400' : index === 1 ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'}`}>
                                {method.contact}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Info */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl mr-4">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('policies.refund.sidebar.quickInfo.title')}</h3>
                    </div>
                    <div className="space-y-4">
                      {(t('policies.refund.sidebar.quickInfo.items') as any[]).map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          {index === 0 ? <Clock className="h-5 w-5 text-red-600 mr-3" /> : 
                           index === 1 ? <CheckCircle className="h-5 w-5 text-green-600 mr-3" /> : 
                           <Zap className="h-5 w-5 text-yellow-600 mr-3" />}
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ */}
              <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('policies.refund.sidebar.faq.title')}</h3>
                    <div className="space-y-6">
                      {(t('policies.refund.sidebar.faq.questions') as any[]).map((faq, index) => (
                        <div key={index} className={`border-l-4 ${index === 0 ? 'border-blue-500' : index === 1 ? 'border-green-500' : 'border-purple-500'} pl-4`}>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CTA */}
              <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <Card className="bg-gradient-to-r from-red-600 to-orange-600 border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">{t('policies.refund.sidebar.cta.title')}</h3>
                    <p className="text-red-100 mb-6">
                      {t('policies.refund.sidebar.cta.description')}
                    </p>
                                                <Button 
                              onClick={() => setHelpOpen(true)}
                              className="bg-white text-red-600 hover:bg-gray-100 w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              {t('policies.refund.contact')}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onContactClick={() => setHelpOpen(true)} />
      <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
} 