'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Zap, 
  Check, 
  Star,
  Sun,
  Moon,
  Bell,
  Globe,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import { useLanguage } from '@/contexts/language-context'
import StripePayment from '@/components/payments/StripePayment'
import { useAuth } from '@/contexts/auth-context'
import { useCreditsSimple } from '@/hooks/useCredits-simple'

function PricingPageContent() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { credits, refresh: refreshCredits, loading: creditsLoading } = useCreditsSimple()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [helpOpen, setHelpOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

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

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 处理URL参数，自动打开对应的支付弹窗
  useEffect(() => {
    const planParam = searchParams.get('plan')
    if (planParam && user) {
      const plan = pricingPlans.find(p => p.id === planParam)
      if (plan) {
        setSelectedPlan(plan)
        setPaymentOpen(true)
        // 清除URL参数，避免刷新页面时重复打开
        router.replace('/pricing', { scroll: false })
      }
    }
  }, [searchParams, user, router])

  const pricingPlans = [
    {
      id: 'basic',
      name: t('pricing.plans.basic.name'),
      description: t('pricing.plans.basic.description'),
      originalPrice: t('pricing.plans.basic.originalPrice'),
      currentPrice: t('pricing.plans.basic.currentPrice'),
      price: 9.99,
      credits: 100,
      creditsText: t('pricing.plans.basic.credits'),
      features: t('pricing.plans.basic.features') as string[],
      popular: false
    },
    {
      id: 'standard',
      name: t('pricing.plans.standard.name'),
      description: t('pricing.plans.standard.description'),
      originalPrice: t('pricing.plans.standard.originalPrice'),
      currentPrice: t('pricing.plans.standard.currentPrice'),
      price: 29.99,
      credits: 500,
      creditsText: t('pricing.plans.standard.credits'),
      features: t('pricing.plans.standard.features') as string[],
      popular: true
    },
    {
      id: 'premium',
      name: t('pricing.plans.premium.name'),
      description: t('pricing.plans.premium.description'),
      originalPrice: t('pricing.plans.premium.originalPrice'),
      currentPrice: t('pricing.plans.premium.currentPrice'),
      price: 49.99,
      credits: 1000,
      creditsText: t('pricing.plans.premium.credits'),
      features: t('pricing.plans.premium.features') as string[],
      popular: false
    }
  ]

  const handlePurchase = (plan: any) => {
    if (!user) {
      // 如果用户未登录，重定向到登录页面
      window.location.href = '/login'
      return
    }
    
    setSelectedPlan(plan)
    setPaymentOpen(true)
  }

  // 如果积分加载中，显示加载状态
  if (creditsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar currentPage="pricing" theme={theme} onThemeToggle={toggleTheme} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        </div>
        <Footer onContactClick={() => setHelpOpen(true)} />
        <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
      </div>
    )
  }

  const handlePaymentSuccess = (credits: number) => {
    refreshCredits()
    setPaymentOpen(false)
    setSelectedPlan(null)
    // 可以显示成功消息
    alert(`支付成功！已获得 ${credits} 积分`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar currentPage="pricing" theme={theme} onThemeToggle={toggleTheme} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 {/* Title Section */}
         <div className="text-center mb-12 sm:mb-16">
           <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">{t('pricing.title')}</h1>
           <p className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
             {t('pricing.subtitle')}
           </p>
           {user && credits && (
             <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg inline-block">
               <p className="text-blue-600 dark:text-blue-400 font-medium">
                 {t('pricing.currentBalance')}: {credits.credits} {t('pricing.credits')}
               </p>
             </div>
           )}
         </div>

                 {/* Pricing Cards */}
         <div className="w-full mb-16 sm:mb-20">
           <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
             {pricingPlans.map((plan, index) => (
               <Card key={index} className={`items-stretch rounded-xl border shadow-xs relative flex h-full min-h-[600px] min-w-[320px] flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-400 ${plan.popular ? 'scale-105 border-blue-500 dark:border-blue-400 shadow-md shadow-blue-500/20 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/30' : ''}`}>
                 {plan.popular && (
                   <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                     <span className="inline-flex items-center justify-center border focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md h-6 min-w-6 gap-1.5 px-3 py-1 text-xs font-medium border-primary bg-primary text-primary-foreground">
                       {t('pricing.plans.standard.popular')}
                     </span>
                   </div>
                 )}
                 <div className="flex-wrap min-h-14 gap-2.5 border-b border-gray-200 dark:border-gray-700 relative flex flex-col items-start justify-start p-6">
                   <div className="flex w-full items-center justify-between">
                     <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${plan.popular ? 'border-blue-500/30 dark:border-blue-400/50 bg-blue-500/20 dark:bg-blue-500/30 text-blue-500 shadow-blue-500/20 hover:scale-110 hover:bg-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40' : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400'}`}>
                       <Zap className="h-6 w-6" />
                     </div>
                     <h3 className={`text-xl font-bold tracking-tight ${plan.popular ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}>{plan.name}</h3>
                   </div>
                   <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">{plan.description}</p>
                   <div className="flex w-full items-center justify-between">
                     <div className="flex items-baseline justify-center gap-2">
                       <span className={`text-3xl font-bold tracking-tight ${plan.popular ? 'text-blue-500' : 'text-gray-900 dark:text-white'}`}>{plan.currentPrice}</span>
                       <span className="text-lg text-gray-500 dark:text-gray-400 line-through">{plan.originalPrice}</span>
                     </div>
                     {plan.id === 'standard' && (
                       <span className="inline-flex items-center rounded-full bg-green-100 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                         节省 55%
                       </span>
                     )}
                     {plan.id === 'premium' && (
                       <span className="inline-flex items-center rounded-full bg-green-100 text-xs font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400">
                         节省 58%
                       </span>
                     )}
                   </div>
                   <div className="flex items-center justify-center gap-1">
                     <span className="text-lg font-semibold text-gray-900 dark:text-white">{plan.credits}</span>
                     <span className="text-sm text-gray-600 dark:text-gray-300">积分</span>
                   </div>
                 </div>
                 <div className="p-6 flex-1 px-8 pb-6">
                   <ul className="space-y-2">
                     {plan.features.map((feature, featureIndex) => (
                       <li key={featureIndex} className="flex items-start gap-2">
                         <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                         <span className="text-sm text-gray-900 dark:text-white">{feature}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 <div className="flex items-center px-6 min-h-14 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                   <Button 
                     onClick={() => handlePurchase(plan)}
                     className={`w-full transition-all duration-300 ${plan.popular ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40' : 'border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:scale-105'}`}
                   >
                     {plan.popular ? t('pricing.plans.standard.button') : t('pricing.plans.basic.button')}
                   </Button>
                 </div>
               </Card>
             ))}
           </div>
         </div>

                 {/* How to Use Points Section */}
         <div className="mb-16">
           <h2 className="text-3xl font-bold text-center mb-8">{t('pricing.howToUse.title')}</h2>
           <div className="flex flex-wrap justify-center items-center gap-16 text-center">
             <div className="flex items-center space-x-2">
               <span className="text-2xl font-bold text-blue-600">{t('pricing.howToUse.creditRate')}</span>
             </div>
             {(t('pricing.howToUse.steps') as string[]).map((step, index) => (
               <div key={index} className="flex items-center space-x-2">
                 <span className="text-gray-700 dark:text-gray-300">{step}</span>
               </div>
             ))}
           </div>
         </div>

                 {/* FAQ Section */}
         <div className="max-w-4xl mx-auto">
           <h2 className="text-3xl font-bold text-center mb-8 border-b-2 border-blue-600 pb-2">{t('pricing.faq.title')}</h2>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <Accordion type="single" collapsible className="space-y-4">
               {(t('pricing.faq.questions') as any[]).slice(0, 2).map((faq, index) => (
                 <AccordionItem key={index} value={`item-${index + 1}`} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4">
                   <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                     <h3 className="text-lg font-semibold">{faq.question}</h3>
                   </AccordionTrigger>
                   <AccordionContent className="text-gray-700 dark:text-gray-300">
                     {faq.answer}
                   </AccordionContent>
                 </AccordionItem>
               ))}
             </Accordion>

             <Accordion type="single" collapsible className="space-y-4">
               {(t('pricing.faq.questions') as any[]).slice(2, 4).map((faq, index) => (
                 <AccordionItem key={index + 2} value={`item-${index + 3}`} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-4">
                   <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                     <h3 className="text-lg font-semibold">{faq.question}</h3>
                   </AccordionTrigger>
                   <AccordionContent className="text-gray-700 dark:text-gray-300">
                     {faq.answer}
                   </AccordionContent>
                 </AccordionItem>
               ))}
             </Accordion>
           </div>
         </div>
      </div>

              <Footer onContactClick={() => setHelpOpen(true)} />
        <HelpWidget isOpen={helpOpen} onOpenChange={setHelpOpen} />
        
        {/* 支付弹窗 */}
        {selectedPlan && (
          <StripePayment
            plan={selectedPlan}
            isOpen={paymentOpen}
            onClose={() => {
              setPaymentOpen(false)
              setSelectedPlan(null)
            }}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    )
}

export default function PricingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PricingPageContent />
    </Suspense>
  )
} 