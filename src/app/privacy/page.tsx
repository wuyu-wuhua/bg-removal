'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  Eye,
  Lock,
  Database,
  Clock,
  Users,
  Zap,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  Globe,
  Server
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import { useLanguage } from '@/contexts/language-context'

export default function PrivacyPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-500">
      <Navbar theme={theme} onThemeToggle={toggleTheme} currentPage="privacy" />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-600/10 to-teal-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-start mb-8">
              <Link href="/" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 hover:scale-105">
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('policies.privacy.backToHome')}
              </Link>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
                <Shield className="h-4 w-4 mr-2" />
                {t('policies.privacy.badge')}
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-green-800 to-emerald-800 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent">
                {t('policies.privacy.title')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                {t('policies.privacy.description')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Lock className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.privacy.heroStats.dataEncryption')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Eye className="h-5 w-5 text-emerald-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.privacy.heroStats.privacyProtection')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Shield className="h-5 w-5 text-teal-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.privacy.heroStats.securityReliable')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Policy Overview */}
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.privacy.overview.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-6 text-gray-600 dark:text-gray-300">
                      <p className="text-lg leading-relaxed">
                        {t('policies.privacy.overview.description')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(t('policies.privacy.overview.features') as any[]).map((feature: any, index: number) => (
                          <div key={index} className={`${index === 0 ? 'bg-green-50 dark:bg-green-900/20' : index === 1 ? 'bg-emerald-50 dark:bg-emerald-900/20' : index === 2 ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-blue-50 dark:bg-blue-900/20'} p-6 rounded-xl`}>
                            <div className="flex items-center mb-4">
                              {index === 0 ? <Shield className="h-6 w-6 text-green-600 mr-3" /> :
                               index === 1 ? <Eye className="h-6 w-6 text-emerald-600 mr-3" /> :
                               index === 2 ? <Lock className="h-6 w-6 text-teal-600 mr-3" /> :
                               <Clock className="h-6 w-6 text-blue-600 mr-3" />}
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

              {/* Information Collection */}
              <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <Database className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.privacy.informationCollection.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          {t('policies.privacy.informationCollection.weCollect.title')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(t('policies.privacy.informationCollection.weCollect.items') as string[]).map((item: string, index: number) => (
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
                          {t('policies.privacy.informationCollection.weDontCollect.title')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(t('policies.privacy.informationCollection.weDontCollect.items') as string[]).map((item: string, index: number) => (
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

              {/* Information Usage */}
              <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.privacy.informationUsage.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {(t('policies.privacy.informationUsage.purposes') as any[]).map((purpose: any, index: number) => (
                        <div key={index} className="text-center group">
                          <div className={`${index === 0 ? 'bg-gradient-to-br from-teal-600 to-blue-600' : index === 1 ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-indigo-600 to-purple-600'} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                            <span className="text-2xl font-bold text-white">{purpose.number}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{purpose.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {purpose.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Protection */}
              <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.privacy.dataProtection.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(t('policies.privacy.dataProtection.methods') as any[]).map((method: any, index: number) => (
                        <div key={index} className={`${index === 0 ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' : index === 1 ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : index === 2 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'} p-6 rounded-xl`}>
                          <div className="flex items-center mb-4">
                            <div className={`${index === 0 ? 'bg-purple-600' : index === 1 ? 'bg-green-600' : index === 2 ? 'bg-blue-600' : 'bg-orange-600'} p-3 rounded-lg mr-4`}>
                              {index === 0 ? <Server className="h-6 w-6 text-white" /> :
                               index === 1 ? <Database className="h-6 w-6 text-white" /> :
                               index === 2 ? <Users className="h-6 w-6 text-white" /> :
                               <Clock className="h-6 w-6 text-white" />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{method.title}</p>
                              <p className={`${index === 0 ? 'text-purple-600 dark:text-purple-400' : index === 1 ? 'text-green-600 dark:text-green-400' : index === 2 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                {method.subtitle}
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
              {/* Privacy Highlights */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl mr-4">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('policies.privacy.sidebar.privacyHighlights.title')}</h3>
                    </div>
                    <div className="space-y-4">
                      {(t('policies.privacy.sidebar.privacyHighlights.items') as any[]).map((item: any, index: number) => (
                        <div key={index} className="flex items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          {index === 0 ? <Lock className="h-5 w-5 text-green-600 mr-3" /> :
                           index === 1 ? <Eye className="h-5 w-5 text-emerald-600 mr-3" /> :
                           <Shield className="h-5 w-5 text-teal-600 mr-3" />}
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{item.title}</span>
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
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('policies.privacy.sidebar.faq.title')}</h3>
                    <div className="space-y-6">
                      {(t('policies.privacy.sidebar.faq.questions') as any[]).map((faq: any, index: number) => (
                        <div key={index} className={`border-l-4 ${index === 0 ? 'border-green-500' : index === 1 ? 'border-emerald-500' : 'border-teal-500'} pl-4`}>
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

              {/* Contact */}
              <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">{t('policies.privacy.sidebar.contact.title')}</h3>
                    <p className="text-green-100 mb-6">
                      {t('policies.privacy.sidebar.contact.description')}
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <Mail className="h-5 w-5 text-white mr-2" />
                        <span className="text-green-100">{t('policies.privacy.email')}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <Phone className="h-5 w-5 text-white mr-2" />
                        <span className="text-green-100">{t('policies.privacy.phone')}</span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.open('https://mail.google.com/mail/u/1/#inbox?compose=new', '_blank')}
                      className="bg-white text-green-600 hover:bg-gray-100 w-full mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {t('policies.privacy.sidebar.contact.sendEmail')}
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