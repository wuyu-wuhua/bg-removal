'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  Search,
  BookOpen,
  Settings,
  Shield,
  CreditCard,
  User,
  Zap,
  FileText,
  HelpCircle,
  ChevronRight,
  Mail,
  Phone,
  MessageCircle,
  Star,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import { useLanguage } from '@/contexts/language-context'

// 帮助分类配置
const getHelpCategories = (t: any) => [
  {
    icon: <Zap className="h-8 w-8" />,
    title: t('help.categories.gettingStarted.title'),
    description: t('help.categories.gettingStarted.description'),
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50",
    darkBgColor: "from-blue-900/20 to-cyan-900/20",
    items: t('help.categories.gettingStarted.items')
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: t('help.categories.features.title'),
    description: t('help.categories.features.description'),
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50",
    darkBgColor: "from-purple-900/20 to-pink-900/20",
    items: t('help.categories.features.items')
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: t('help.categories.security.title'),
    description: t('help.categories.security.description'),
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-50 to-emerald-50",
    darkBgColor: "from-green-900/20 to-emerald-900/20",
    items: t('help.categories.security.items')
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: t('help.categories.billing.title'),
    description: t('help.categories.billing.description'),
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    darkBgColor: "from-orange-900/20 to-red-900/20",
    items: t('help.categories.billing.items')
  }
]

// 热门文章配置
const getPopularArticles = (t: any) => t('help.popularArticles.articles')

export default function HelpPage() {
  const { t } = useLanguage()
  const [helpOpen, setHelpOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
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
      <Navbar theme={theme} onThemeToggle={toggleTheme} currentPage="help" />

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
                {t('help.backToHome')}
              </Link>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
                <HelpCircle className="h-4 w-4 mr-2" />
                {t('help.badge')}
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                {t('help.title')}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                {t('help.description')}
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('help.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('help.categories.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('help.categories.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {getHelpCategories(t).map((category: any, index: number) => (
              <div 
                key={index}
                className={`transition-all duration-1000 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <Card className="group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <div className="text-white">
                        {category.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{category.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{category.description}</p>
                    
                    <ul className="space-y-3">
                      {(category.items as string[]).map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="flex items-center text-gray-600 dark:text-gray-400 group/item">
                          <ChevronRight className="h-4 w-4 mr-2 text-blue-500 group-hover/item:translate-x-1 transition-transform" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      {t('common.viewPricing')}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('help.popularArticles.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t('help.popularArticles.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(getPopularArticles(t) as any[]).map((article: any, index: number) => (
              <div 
                key={index}
                className={`transition-all duration-1000 delay-${index * 200} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
              >
                <Card className="group bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                          {article.category}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>{article.views} {t('help.views')}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                        <span>{article.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('help.contactSupport.subtitle')}
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">{t('help.contactSupport.title')}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              {t('help.contactSupport.description')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {(t('help.contactSupport.methods') as any[]).map((method: any, index: number) => (
                <div key={index} className={`${index === 0 ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : index === 1 ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20'} p-8 rounded-2xl`}>
                  <div className={`${index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-green-600' : 'bg-purple-600'} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    {index === 0 ? <Mail className="h-8 w-8 text-white" /> : 
                     index === 1 ? <Phone className="h-8 w-8 text-white" /> : 
                     <MessageCircle className="h-8 w-8 text-white" />}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{method.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{method.description}</p>
                  <Button 
                    onClick={() => {
                      if (index === 0) {
                        window.open('https://mail.google.com/mail/u/1/#inbox?compose=new', '_blank')
                      } else if (index === 1) {
                        window.open('tel:+02362872229', '_blank')
                      } else {
                        setHelpOpen(true)
                      }
                    }}
                    className={`${index === 0 ? 'bg-blue-600 hover:bg-blue-700' : index === 1 ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-xl`}
                  >
                    {method.button}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer onContactClick={() => setHelpOpen(true)} />
      <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  )
}