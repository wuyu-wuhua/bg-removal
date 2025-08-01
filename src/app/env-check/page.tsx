'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState<any>(null)

  const checkEnvVars = async () => {
    try {
      const response = await fetch('/api/env-check')
      const data = await response.json()
      setEnvVars(data)
    } catch (error) {
      console.error('Error checking environment variables:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          环境变量检查
        </h1>

        <Card>
          <CardContent className="p-6">
            <Button onClick={checkEnvVars} className="w-full mb-6">
              检查环境变量
            </Button>

            {envVars && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">检查结果：</h2>
                
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">必需的环境变量：</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>API_302AI_KEY:</span>
                      <span className={envVars.environment?.API_302AI_KEY === '已设置' ? 'text-green-600' : 'text-red-600'}>
                        {envVars.environment?.API_302AI_KEY || '未检查'}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>API_302AI_BASE_URL:</span>
                      <span className={envVars.environment?.API_302AI_BASE_URL === '已设置' ? 'text-green-600' : 'text-red-600'}>
                        {envVars.environment?.API_302AI_BASE_URL || '未检查'}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                      <span className={envVars.environment?.NEXT_PUBLIC_SUPABASE_URL === '已设置' ? 'text-green-600' : 'text-red-600'}>
                        {envVars.environment?.NEXT_PUBLIC_SUPABASE_URL || '未检查'}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>SUPABASE_SERVICE_ROLE_KEY:</span>
                      <span className={envVars.environment?.SUPABASE_SERVICE_ROLE_KEY === '已设置' ? 'text-green-600' : 'text-red-600'}>
                        {envVars.environment?.SUPABASE_SERVICE_ROLE_KEY || '未检查'}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">完整响应：</h3>
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(envVars, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">配置说明</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>1. 创建 .env.local 文件</strong><br/>
                在项目根目录创建 <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env.local</code> 文件
              </p>
              
              <p>
                <strong>2. 添加以下环境变量：</strong>
              </p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-xs">
                API_302AI_KEY=sk-sxmyz7pjNiW8RzjsaPkJn4JTw6KZrArxmZjGbv0zGMqrmORl<br/>
                API_302AI_BASE_URL=https://api.302.ai<br/>
                NEXT_PUBLIC_SUPABASE_URL=https://lzhygldaxzrhqoxjyymc.supabase.co<br/>
                SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
              </div>
              
              <p>
                <strong>3. 重启开发服务器</strong><br/>
                修改环境变量后需要重启服务器才能生效
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 