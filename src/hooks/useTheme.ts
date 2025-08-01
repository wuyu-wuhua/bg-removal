import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light') // 默认浅色主题

  // 初始化主题
  useEffect(() => {
    // 获取当前主题状态
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = document.documentElement.classList.contains('dark')
    
    // 确定初始主题
    let initialTheme: 'light' | 'dark'
    if (savedTheme) {
      initialTheme = savedTheme
    } else if (isDark) {
      initialTheme = 'dark'
    } else {
      initialTheme = prefersDark ? 'dark' : 'light'
    }
    
    setTheme(initialTheme)
    
    // 确保DOM有正确的主题类
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // 主题切换功能
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
  }

  return { theme, toggleTheme }
} 