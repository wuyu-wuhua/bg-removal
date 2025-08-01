'use client'

import { useState } from 'react'

interface CameraLogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function CameraLogo({ size = 'md', showText = true, className = '' }: CameraLogoProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {!imageError ? (
        <div className={`${sizeClasses[size]} flex items-center justify-center`}>
          {/* 相机图标 - 只显示相机部分，无背景框 */}
          <svg 
            viewBox="0 0 24 24" 
            className="w-full h-full"
            fill="currentColor"
          >
            {/* 相机主体 */}
            <rect 
              x="4" 
              y="6" 
              width="16" 
              height="12" 
              rx="2" 
              fill="white" 
              stroke="black" 
              strokeWidth="0.5"
            />
            {/* 相机顶部按钮 */}
            <rect 
              x="6" 
              y="4" 
              width="4" 
              height="2" 
              rx="1" 
              fill="white" 
              stroke="black" 
              strokeWidth="0.5"
            />
            {/* 相机镜头 */}
            <circle 
              cx="12" 
              cy="12" 
              r="3" 
              fill="white" 
              stroke="black" 
              strokeWidth="0.5"
            />
            {/* 镜头内的叶子 */}
            <path 
              d="M11 11.5C11 11.5 11.5 10.5 12 11.5C12.5 12.5 12.5 13.5 12 13.5C11.5 13.5 11 12.5 11 11.5Z" 
              fill="#4ade80"
              stroke="#22c55e"
              strokeWidth="0.2"
            />
            {/* 叶子叶脉 */}
            <path 
              d="M11.5 11.5L12 12.5" 
              stroke="#22c55e" 
              strokeWidth="0.3" 
              fill="none"
            />
          </svg>
        </div>
      ) : (
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-lg flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">抠</span>
        </div>
      )}
      {showText && (
        <span className={`font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse ${textSizes[size]}`}>
          背景移除
        </span>
      )}
    </div>
  )
} 