'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

interface EnvCheckResult {
  success: boolean
  environment: string
  timestamp: string
  envCheck: {
    database: {
      url: string
      hasUrl: boolean
    }
    supabase: {
      url: string
      anonKey: string
      serviceKey: string
      hasUrl: boolean
      hasAnonKey: boolean
      hasServiceKey: boolean
    }
    stripe: {
      secretKey: string
      publishableKey: string
      webhookSecret: string
      hasSecretKey: boolean
      hasPublishableKey: boolean
      hasWebhookSecret: boolean
    }
    app: {
      publicUrl: string
      serverUrl: string
    }
  }
  dbConnectionTest: string
  recommendations: {
    database: string
    supabase: string
    stripe: string
    webhook: string
  }
}

export default function EnvCheckPage() {
  const [envData, setEnvData] = useState<EnvCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkEnvironment = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/env-check')
      const data = await response.json()
      
      if (data.success) {
        setEnvData(data)
      } else {
        setError(data.error || '检查失败')
      }
    } catch (err) {
      setError('网络错误，无法连接到服务器')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  const getStatusIcon = (status: string) => {
    if (status.includes('✅')) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (status.includes('❌')) return <XCircle className="w-5 h-5 text-red-500" />
    return <AlertCircle className="w-5 h-5 text-yellow-500" />
  }

  const getStatusColor = (status: string) => {
    if (status.includes('✅')) return 'text-green-600'
    if (status.includes('❌')) return 'text-red-600'
    return 'text-yellow-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              环境变量检查
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              检查Vercel环境变量配置是否正确
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Button 
              onClick={checkEnvironment} 
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '检查中...' : '重新检查'}
            </Button>
          </div>

          {error && (
            <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {envData && (
            <div className="space-y-6">
              {/* 环境信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    环境信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">环境:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {envData.environment}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">检查时间:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {new Date(envData.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 数据库配置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    数据库配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>数据库URL:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.envCheck.database.url)}
                        <span className={getStatusColor(envData.envCheck.database.url)}>
                          {envData.envCheck.database.url}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>数据库连接测试:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.dbConnectionTest)}
                        <span className={getStatusColor(envData.dbConnectionTest)}>
                          {envData.dbConnectionTest}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supabase配置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Supabase配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Supabase URL:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.envCheck.supabase.url)}
                        <span className={getStatusColor(envData.envCheck.supabase.url)}>
                          {envData.envCheck.supabase.url}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>匿名密钥:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.envCheck.supabase.anonKey)}
                        <span className={getStatusColor(envData.envCheck.supabase.anonKey)}>
                          {envData.envCheck.supabase.anonKey}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>服务密钥:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.envCheck.supabase.serviceKey)}
                        <span className={getStatusColor(envData.envCheck.supabase.serviceKey)}>
                          {envData.envCheck.supabase.serviceKey}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stripe配置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Stripe配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>密钥:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.envCheck.stripe.secretKey)}
                        <span className={getStatusColor(envData.envCheck.stripe.secretKey)}>
                          {envData.envCheck.stripe.secretKey}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>发布密钥:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.envCheck.stripe.publishableKey)}
                        <span className={getStatusColor(envData.envCheck.stripe.publishableKey)}>
                          {envData.envCheck.stripe.publishableKey}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Webhook密钥:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(envData.envCheck.stripe.webhookSecret)}
                        <span className={getStatusColor(envData.envCheck.stripe.webhookSecret)}>
                          {envData.envCheck.stripe.webhookSecret}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 应用配置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    应用配置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">公共URL:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {envData.envCheck.app.publicUrl}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">服务器URL:</span>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {envData.envCheck.app.serverUrl}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 建议 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    配置建议
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="font-medium">数据库:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {envData.recommendations.database}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">Supabase:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {envData.recommendations.supabase}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">Stripe:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {envData.recommendations.stripe}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium">Webhook:</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {envData.recommendations.webhook}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 