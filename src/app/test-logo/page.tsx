'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CameraLogo from '@/components/camera-logo'

export default function TestLogoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          返回首页
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Logo 测试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 浅色背景测试 */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">浅色背景测试</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">小尺寸:</span>
                <CameraLogo size="sm" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">中尺寸:</span>
                <CameraLogo size="md" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">大尺寸:</span>
                <CameraLogo size="lg" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">带文字:</span>
                <CameraLogo size="md" showText={true} />
              </div>
            </div>
          </div>

          {/* 深色背景测试 */}
          <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">深色背景测试</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">小尺寸:</span>
                <CameraLogo size="sm" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">中尺寸:</span>
                <CameraLogo size="md" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">大尺寸:</span>
                <CameraLogo size="lg" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">带文字:</span>
                <CameraLogo size="md" showText={true} />
              </div>
            </div>
          </div>

          {/* 渐变背景测试 */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6">渐变背景测试</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/80">小尺寸:</span>
                <CameraLogo size="sm" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/80">中尺寸:</span>
                <CameraLogo size="md" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/80">大尺寸:</span>
                <CameraLogo size="lg" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/80">带文字:</span>
                <CameraLogo size="md" showText={true} />
              </div>
            </div>
          </div>

          {/* 透明背景测试 */}
          <div className="bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">透明背景测试</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">小尺寸:</span>
                <CameraLogo size="sm" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">中尺寸:</span>
                <CameraLogo size="md" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">大尺寸:</span>
                <CameraLogo size="lg" showText={false} />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">带文字:</span>
                <CameraLogo size="md" showText={true} />
              </div>
            </div>
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">说明</h3>
          <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
            <li>• 如果logo显示有彩色背景，说明图片本身包含背景</li>
            <li>• 如果logo显示透明，说明图片有透明背景</li>
            <li>• 请确保您的logo图片文件有透明背景</li>
            <li>• 推荐使用PNG格式，支持透明背景</li>
                            <li>• 现在使用纯SVG相机图标，无需图片文件</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 