'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Shield,
  Users,
  Zap,
  Sparkles,
  ArrowRight,
  Lock,
  Globe,
  Clock,
  Scale,
  BookOpen,
  Mail,
  Phone,
  Server,
  Database
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import { useLanguage } from '@/contexts/language-context'

export default function TermsPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white transition-all duration-500">
      <Navbar theme={theme} onThemeToggle={toggleTheme} currentPage="terms" />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-blue-600/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="flex items-center justify-start mb-8">
              <Link href="/" className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105">
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                {t('policies.terms.backToHome')}
              </Link>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
                <BookOpen className="h-4 w-4 mr-2" />
                {t('policies.terms.badge')}
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 dark:from-white dark:via-purple-200 dark:to-indigo-200 bg-clip-text text-transparent">
                {t('policies.terms.title')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                {t('policies.terms.content')}
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Scale className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.terms.heroStats.legalProtection')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Shield className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.terms.heroStats.rightsProtection')}</span>
                </div>
                <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">{t('policies.terms.heroStats.userFriendly')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Agreement Overview */}
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.terms.overview.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-6 text-gray-600 dark:text-gray-300">
                      <p className="text-lg leading-relaxed">
                        {t('policies.terms.overview.description')}
                      </p>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {(t('policies.terms.overview.features') as any[]).map((feature, index) => (
                            <div key={index} className={`${index === 0 ? 'bg-purple-50 dark:bg-purple-900/20' : index === 1 ? 'bg-indigo-50 dark:bg-indigo-900/20' : index === 2 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'} p-6 rounded-xl`}>
                              <div className="flex items-center mb-4">
                                {index === 0 ? <Scale className="h-6 w-6 text-purple-600 mr-3" /> : 
                                 index === 1 ? <Shield className="h-6 w-6 text-indigo-600 mr-3" /> : 
                                 index === 2 ? <Users className="h-6 w-6 text-blue-600 mr-3" /> : 
                                 <Clock className="h-6 w-6 text-green-600 mr-3" />}
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

              {/* Service Description */}
              <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.terms.serviceDescription.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg mr-3">
                            <CheckCircle className="h-5 w-5 text-indigo-600" />
                          </div>
                          {t('policies.terms.serviceDescription.content.title')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(t('policies.terms.serviceDescription.content.services') as string[]).map((service, index) => (
                            <div key={index} className="flex items-start p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{service}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                            <Globe className="h-5 w-5 text-blue-600" />
                          </div>
                          {t('policies.terms.serviceDescription.scope.title')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(t('policies.terms.serviceDescription.scope.items') as string[]).map((item, index) => (
                            <div key={index} className="flex items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Rights and Obligations */}
              <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.terms.userRights.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-blue-600 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                          <span className="text-2xl font-bold text-white">✓</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('policies.terms.userRights.rights.title')}</h3>
                        <div className="space-y-3 text-left">
                          {(t('policies.terms.userRights.rights.items') as string[]).map((item, index) => (
                            <div key={index} className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-center group">
                        <div className="bg-gradient-to-br from-green-600 to-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                          <span className="text-2xl font-bold text-white">!</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('policies.terms.userRights.obligations.title')}</h3>
                        <div className="space-y-3 text-left">
                          {(t('policies.terms.userRights.obligations.items') as string[]).map((item, index) => (
                            <div key={index} className="flex items-start p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Prohibited Activities */}
              <div className={`transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-white/20 p-3 rounded-xl mr-4">
                        <AlertCircle className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white">{t('policies.terms.prohibitedActivities.title')}</h2>
                    </div>
                  </div>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {(t('policies.terms.prohibitedActivities.activities') as any[]).map((activity, index) => (
                        <div key={index} className={`${index === 0 ? 'bg-red-50 dark:bg-red-900/20' : index === 1 ? 'bg-orange-50 dark:bg-orange-900/20' : index === 2 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-purple-50 dark:bg-purple-900/20'} p-6 rounded-xl`}>
                          <div className="flex items-center mb-4">
                            <div className={`${index === 0 ? 'bg-red-600' : index === 1 ? 'bg-orange-600' : index === 2 ? 'bg-yellow-600' : 'bg-purple-600'} p-3 rounded-lg mr-4`}>
                              {index === 0 ? <AlertCircle className="h-6 w-6 text-white" /> : 
                               index === 1 ? <Server className="h-6 w-6 text-white" /> : 
                               index === 2 ? <Database className="h-6 w-6 text-white" /> : 
                               <Lock className="h-6 w-6 text-white" />}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{activity.title}</p>
                              <p className={`${index === 0 ? 'text-red-600 dark:text-red-400' : index === 1 ? 'text-orange-600 dark:text-orange-400' : index === 2 ? 'text-yellow-600 dark:text-yellow-400' : 'text-purple-600 dark:text-purple-400'}`}>
                                {activity.subtitle}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Key Points */}
              <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl mr-4">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('policies.terms.sidebar.keyPoints.title')}</h3>
                    </div>
                    <div className="space-y-4">
                      {(t('policies.terms.sidebar.keyPoints.items') as any[]).map((item, index) => (
                        <div key={index} className="flex items-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                          {index === 0 ? <Scale className="h-5 w-5 text-purple-600 mr-3" /> : 
                           index === 1 ? <Shield className="h-5 w-5 text-indigo-600 mr-3" /> : 
                           <Users className="h-5 w-5 text-blue-600 mr-3" />}
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
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t('policies.terms.sidebar.faq.title')}</h3>
                    <div className="space-y-6">
                      {(t('policies.terms.sidebar.faq.questions') as any[]).map((faq, index) => (
                        <div key={index} className={`border-l-4 ${index === 0 ? 'border-purple-500' : index === 1 ? 'border-indigo-500' : 'border-blue-500'} pl-4`}>
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
                <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">{t('policies.terms.sidebar.contact.title')}</h3>
                    <p className="text-purple-100 mb-6">
                      {t('policies.terms.sidebar.contact.description')}
                    </p>
                                         <div className="space-y-4">
                       <div className="flex items-center justify-center">
                         <Mail className="h-5 w-5 text-white mr-2" />
                         <span className="text-purple-100">q9425916@gmail.com</span>
                       </div>
                       <div className="flex items-center justify-center">
                         <Phone className="h-5 w-5 text-white mr-2" />
                         <span className="text-purple-100">+023 6287 2229</span>
                       </div>
                     </div>
                                         <Button 
                       onClick={() => window.open('https://mail.google.com/mail/u/1/#inbox?compose=new', '_blank')}
                       className="bg-white text-purple-600 hover:bg-gray-100 w-full mt-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                     >
                       {t('policies.terms.sidebar.contact.sendEmail')}
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