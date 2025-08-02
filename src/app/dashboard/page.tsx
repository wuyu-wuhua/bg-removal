'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useLanguage } from '@/contexts/language-context'
import StripePayment from '@/components/payments/StripePayment'
import { 
  User, 
  Settings, 
  LogOut, 
  Upload, 
  Image, 
  History, 
  Star,
  ArrowLeft,
  Sun,
  Moon,
  Menu,
  Bell,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Meteors } from '@/components/magicui/meteors'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import HelpWidget from '@/components/help-widget'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [helpOpen, setHelpOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'generations'>('overview')
  const [creditData, setCreditData] = useState({
    current: 0,
    totalEarned: 0,
    totalConsumed: 0
  })
  const [transactions, setTransactions] = useState<any[]>([])
  const [generations, setGenerations] = useState<any[]>([])
  const [loadingCredits, setLoadingCredits] = useState(true)
  const [lastFetchTime, setLastFetchTime] = useState<number>(0)
  const [dataFetched, setDataFetched] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null)

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

  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleUpload = () => {
    router.push('/upload')
  }

  const handleRefresh = () => {
    setLastFetchTime(0) // 重置缓存时间，强制重新获取
    setDataFetched(false)
  }

  const handlePurchaseCredits = (planId: string) => {
    // 直接在当前页面打开支付弹窗
    const plan = creditPackages.find(pkg => pkg.id === planId)
    if (plan) {
      setSelectedPlan(plan)
      setPaymentOpen(true)
    }
  }

  const handlePaymentSuccess = (credits: number) => {
    // 支付成功后刷新积分数据
    setLastFetchTime(0) // 重置缓存时间，强制重新获取
    setDataFetched(false)
    setPaymentOpen(false)
    setSelectedPlan(null)
    // 可以显示成功消息
            alert(`${t('dashboard.paymentModal.paymentSuccess')} ${credits} ${t('dashboard.credits')}`)
  }

  // 获取用户积分数据
  useEffect(() => {
    const fetchUserCredits = async () => {
      if (!user) return
      
      // 检查是否需要重新获取数据
      const now = Date.now()
      const timeSinceLastFetch = now - lastFetchTime
      const cacheExpiryTime = 30 * 1000 // 30秒缓存，提高实时性
      
      // 如果数据已经获取过且缓存未过期，则跳过重新获取
      if (dataFetched && timeSinceLastFetch < cacheExpiryTime) {
        setLoadingCredits(false)
        return
      }
      
      try {
        setLoadingCredits(true)
        
        // 获取当前积分
        const creditsResponse = await fetch(`/api/user-credits?userId=${user.id}`)
        const creditsData = await creditsResponse.json()
        
        // 获取交易历史
        const transactionsResponse = await fetch(`/api/user-transactions?userId=${user.id}`)
        const transactionsData = await transactionsResponse.json()
        
        // 获取生成记录
        const generationsResponse = await fetch(`/api/user-generations?userId=${user.id}`)
        const generationsData = await generationsResponse.json()
        
        if (creditsData.success && transactionsData.success) {
          const currentCredits = creditsData.credits || 0
          const fetchedTransactions = transactionsData.transactions || []
          
          // 计算累计获得和消费
          let totalEarned = 0
          let totalConsumed = 0
          
          fetchedTransactions.forEach((transaction: any) => {
            // 过滤掉积分回滚和失败的处理
            const description = transaction.description || ''
            const isRollback = description.includes('积分回滚') || 
                              description.includes('回滚') || 
                              description.includes('rollback') ||
                              description.includes('Rollback')
            const isFailed = description.includes('失败') || 
                           description.includes('Failed') ||
                           description.includes('failed') ||
                           description.includes('处理失败')
            
            if (isRollback || isFailed) {
              return
            }
            
            // 根据交易类型和金额计算
            if (transaction.type === 'recharge' || transaction.amount > 0) {
              totalEarned += Math.abs(transaction.amount)
            } else if (transaction.type === 'consumption' || transaction.amount < 0) {
              totalConsumed += Math.abs(transaction.amount)
            }
          })
          
          setCreditData({
            current: currentCredits,
            totalEarned,
            totalConsumed
          })
          
          // 设置交易记录
          setTransactions(fetchedTransactions)
          
          // 设置生成记录
          if (generationsData.success) {
            setGenerations(generationsData.generations || [])
          }
          
          // 更新获取时间和状态
          setLastFetchTime(now)
          setDataFetched(true)
        }
      } catch (error) {
        console.error('获取积分数据失败:', error)
        // 如果获取失败，设置默认值
        setCreditData({
          current: 0,
          totalEarned: 0,
          totalConsumed: 0
        })
      } finally {
        setLoadingCredits(false)
      }
    }
    
    fetchUserCredits()
    
    // 设置定时刷新（每60秒刷新一次）
    if (user) {
      const interval = setInterval(() => {
        setLastFetchTime(0) // 重置缓存时间，强制重新获取
        setDataFetched(false)
      }, 60000) // 60秒
      
      setAutoRefreshInterval(interval)
      
      // 清理定时器
      return () => {
        if (interval) {
          clearInterval(interval)
        }
      }
    }
  }, [user, lastFetchTime, dataFetched])



  const creditPackages = [
    { id: 'basic', name: t('dashboard.creditPackages.basic.name'), price: 9.99, credits: 100, description: t('dashboard.creditPackages.basic.description') },
    { id: 'standard', name: t('dashboard.creditPackages.standard.name'), price: 29.99, credits: 500, description: t('dashboard.creditPackages.standard.description'), recommended: true },
    { id: 'premium', name: t('dashboard.creditPackages.premium.name'), price: 49.99, credits: 1000, description: t('dashboard.creditPackages.premium.description') }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('dashboard.loading')}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* 流星背景 */}
      <Meteors number={30} className="absolute inset-0" />

      <Navbar theme={theme} onThemeToggle={toggleTheme} currentPage="dashboard" />

      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 返回首页按钮 */}
          <div className="flex items-center justify-start mb-8">
            <button 
              onClick={() => router.push('/')}
              className="group flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('common.backToHome')}
            </button>
          </div>

          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('dashboard.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧主要内容区域 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 用户信息卡片 */}
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-3xl font-bold text-white">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {user.user_metadata?.full_name || t('dashboard.welcome')}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 积分概览卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.creditOverview.currentCredits')}</h3>
                    {loadingCredits ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mx-auto"></div>
                      </div>
                    ) : (
                      <p className="text-3xl font-bold text-blue-600">{creditData.current}</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.creditOverview.totalEarned')}</h3>
                    {loadingCredits ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mx-auto"></div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <p className="text-3xl font-bold text-green-600">{creditData.totalEarned}</p>
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('dashboard.creditOverview.totalConsumed')}</h3>
                    {loadingCredits ? (
                      <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20 mx-auto"></div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <p className="text-3xl font-bold text-yellow-600">{creditData.totalConsumed}</p>
                        <TrendingDown className="h-6 w-6 text-yellow-600" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 交易记录区域 */}
              <Card className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-8">
                  {/* 标签页 */}
                  <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`pb-2 px-1 font-medium transition-colors ${
                        activeTab === 'overview'
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {t('dashboard.creditOverview.title')}
                    </button>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className={`pb-2 px-1 font-medium transition-colors ${
                        activeTab === 'transactions'
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {t('dashboard.recentTransactions.title')}
                    </button>
                    <button
                      onClick={() => setActiveTab('generations')}
                      className={`pb-2 px-1 font-medium transition-colors ${
                        activeTab === 'generations'
                          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {t('dashboard.generations.title')}
                    </button>
                    </div>
                    <button
                      onClick={handleRefresh}
                      className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{t('dashboard.recentTransactions.refresh')}</span>
                    </button>
                  </div>

                  {/* 内容区域 */}
                  <div className="max-h-96 overflow-y-auto pr-2">
                    {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.recentTransactions.title')}</h3>
                    <div className="space-y-4">
                          {loadingCredits ? (
                            <div className="space-y-4">
                              {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg animate-pulse">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                    <div>
                                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : transactions.length > 0 ? (
                            transactions.map((transaction, index) => {
                              // 格式化日期
                              const date = new Date(transaction.created_at)
                              const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
                              
                              // 类型国际化
                              let typeText = t('dashboard.recentTransactions.type.unknown')
                              if (transaction.type === 'recharge') typeText = t('dashboard.recentTransactions.type.recharge')
                              else if (transaction.type === 'consumption') typeText = t('dashboard.recentTransactions.type.consumption')
                              else if (transaction.type === 'refund') typeText = t('dashboard.recentTransactions.type.refund')

                              // 充值描述国际化
                              let descText = ''
                              if (transaction.type === 'recharge') {
                                if (transaction.description?.includes('标准')) descText = t('dashboard.creditPackages.standard.name')
                                else if (transaction.description?.includes('基础')) descText = t('dashboard.creditPackages.basic.name')
                                else if (transaction.description?.includes('热门')) descText = t('dashboard.creditPackages.premium.name')
                                else if (transaction.description?.includes('新用户免费积分')) descText = t('common.newUserFreeCredits')
                                else descText = transaction.description || ''
                                descText = t('dashboard.credits') + t('dashboard.recentTransactions.type.recharge') + '：' + descText
                              } else if (transaction.type === 'consumption') {
                                descText = t('dashboard.generations.generatedResult')
                              } else {
                                descText = transaction.description || ''
                              }
                              
                              return (
                                <div key={transaction.id || index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.amount > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                            }`}>
                              {transaction.amount > 0 ? (
                                <TrendingUp className="h-5 w-5 text-green-600" />
                              ) : (
                                <TrendingDown className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                                      <p className="font-medium text-gray-900 dark:text-white">{typeText}</p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount} {t('dashboard.credits')}
                            </p>
                                    {descText && (
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{descText}</p>
                                    )}
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                                                      <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">{t('dashboard.recentTransactions.noTransactions')}</p>
                          </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'transactions' && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.recentTransactions.title')}</h3>
                        {loadingCredits ? (
                          <div className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-4">
                              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-4">
                              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                            </div>
                          </div>
                        ) : transactions.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions.tableHeaders.type')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions.tableHeaders.description')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions.tableHeaders.amount')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions.tableHeaders.date')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions.tableHeaders.status')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactions.map((transaction, index) => {
                                  const date = new Date(transaction.created_at)
                                  const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
                                  
                                  let typeText = t('dashboard.recentTransactions.type.unknown')
                                  switch (transaction.type) {
                                    case 'recharge':
                                      typeText = t('dashboard.recentTransactions.type.recharge')
                                      break
                                    case 'consumption':
                                      typeText = t('dashboard.recentTransactions.type.consumption')
                                      break
                                    case 'refund':
                                      typeText = t('dashboard.recentTransactions.type.refund')
                                      break
                                    default:
                                      typeText = transaction.description || t('dashboard.recentTransactions.type.other')
                                  }
                                  
                                  return (
                                    <tr key={transaction.id || index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                      <td className="py-3 px-4 text-gray-900 dark:text-white">{typeText}</td>
                                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                                        {transaction.description?.includes('新用户免费积分') 
                                          ? t('common.newUserFreeCredits') 
                                          : transaction.description || '-'}
                                      </td>
                                      <td className={`py-3 px-4 font-semibold ${
                                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                      </td>
                                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formattedDate}</td>
                                      <td className="py-3 px-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                          {t('dashboard.recentTransactions.status.success')}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">{t('dashboard.recentTransactions.noTransactions')}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'generations' && (
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.generations.title')}</h3>
                        {loadingCredits ? (
                          <div className="animate-pulse">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-4">
                              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                            </div>
                          </div>
                        ) : generations.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions.tableHeaders.type')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.recentTransactions.tableHeaders.status')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.generations.tableHeaders.result')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.generations.tableHeaders.created')}</th>
                                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">{t('dashboard.generations.tableHeaders.action')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {generations.map((generation, index) => {
                                  const date = new Date(generation.created_at)
                                  const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
                                  
                                  return (
                                    <tr key={generation.id || index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                      <td className="py-3 px-4 text-gray-900 dark:text-white">{t('dashboard.generations.image')}</td>
                                      <td className="py-3 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          generation.status === 'completed' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : generation.status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                          {generation.status === 'completed' ? t('dashboard.recentTransactions.status.success') : generation.status === 'processing' ? t('dashboard.recentTransactions.status.pending') : t('dashboard.recentTransactions.status.failed')}
                                        </span>
                                      </td>
                                      <td className="py-3 px-4">
                                        {generation.processed_image_url ? (
                                          <img 
                                            src={generation.processed_image_url} 
                                            alt={t('dashboard.generations.generatedResult')} 
                                            className="w-12 h-12 object-cover rounded-lg"
                                          />
                                        ) : (
                                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                            <Image className="h-6 w-6 text-gray-400" />
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formattedDate}</td>
                                      <td className="py-3 px-4">
                                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                          {t('dashboard.generations.view')}
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">{t('dashboard.generations.noGenerations')}</p>
                        </div>
                        )}
                    </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧积分套餐区域 */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.creditPackages.title')}</h3>
              {creditPackages.map((pkg, index) => (
                <Card key={index} className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    {pkg.recommended && (
                      <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-full mb-3">
                        {t('dashboard.creditPackages.recommended')}
                      </div>
                    )}
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{pkg.name}</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">${pkg.price}</p>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{pkg.credits} {t('dashboard.credits')}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{pkg.description}</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handlePurchaseCredits(pkg.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t('dashboard.creditPackages.buyCredits')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <div className="relative z-10 mt-auto pt-16">
        <Footer onContactClick={() => setHelpOpen(true)} />
      </div>
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