'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Sun, Moon, Menu, User, LogOut, Settings } from 'lucide-react'
import { Button } from './ui/button'
import TransparentLogo from './transparent-logo'
import LanguageSwitcher from './language-switcher'
import { useLanguage } from '@/contexts/language-context'
import { useAuth } from '@/contexts/auth-context'

interface NavbarProps {
  currentPage?: 'home' | 'cases' | 'pricing' | 'about' | 'dashboard' | 'login' | 'upload' | 'refund' | 'service' | 'help' | 'terms' | 'privacy'
  theme?: 'light' | 'dark'
  onThemeToggle?: () => void
}

export default function Navbar({ currentPage = 'home', theme = 'dark', onThemeToggle }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { user, signOut, loading } = useAuth()

  // 调试用户状态
  console.log('Navbar user state:', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    userName: user?.user_metadata?.full_name,
    loading 
  })

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isUserMenuOpen && !target.closest('.user-menu')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-200 supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-8 sm:px-10 lg:px-14">
        <div className="flex h-16 items-center">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <TransparentLogo size="md" showText={true} />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  currentPage === 'home'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('navbar.home')}
              </Link>
              <Link 
                href="/pricing" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  currentPage === 'pricing'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('navbar.pricing')}
              </Link>
              <Link 
                href="/about" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  currentPage === 'about'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {t('navbar.aboutUs')}
              </Link>

            </nav>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4 ml-auto">
            {/* Icon buttons */}
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
            <button 
              onClick={onThemeToggle}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

                         {/* User Menu or CTA Button */}
             {user ? (
               <div className="relative user-menu">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105 rounded-full border-2 border-white dark:border-gray-700 shadow-lg"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="用户头像" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-semibold">
                      {(() => {
                        const name = user.user_metadata?.full_name || '';
                        const email = user.email || '';
                        
                        // 优先显示邮箱的第一个英文字母
                        const emailChar = email.match(/[a-zA-Z]/)?.[0]?.toUpperCase();
                        if (emailChar) return emailChar;
                        
                        // 如果邮箱没有英文字母，显示用户名的第一个英文字母
                        const nameChar = name.match(/[a-zA-Z]/)?.[0]?.toUpperCase();
                        if (nameChar) return nameChar;
                        
                        // 如果都没有英文字母，显示邮箱的第一个字符
                        if (email[0]) return email[0].toUpperCase();
                        
                        // 最后显示默认字符
                        return 'U';
                      })()}
                    </span>
                  )}
                </button>
                
                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {user.user_metadata?.avatar_url ? (
                            <img 
                              src={user.user_metadata.avatar_url} 
                              alt="用户头像" 
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                              {(() => {
                                const name = user.user_metadata?.full_name || '';
                                const email = user.email || '';
                                
                                // 优先显示邮箱的第一个英文字母
                                const emailChar = email.match(/[a-zA-Z]/)?.[0]?.toUpperCase();
                                if (emailChar) return emailChar;
                                
                                // 如果邮箱没有英文字母，显示用户名的第一个英文字母
                                const nameChar = name.match(/[a-zA-Z]/)?.[0]?.toUpperCase();
                                if (nameChar) return nameChar;
                                
                                // 如果都没有英文字母，显示邮箱的第一个字符
                                if (email[0]) return email[0].toUpperCase();
                                
                                // 最后显示默认字符
                                return 'U';
                              })()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.user_metadata?.full_name || '用户'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      个人空间
                    </Link>
                    <Link
                      href="/upload"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      开始使用
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={async () => {
                        await signOut()
                        setIsUserMenuOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={() => window.location.href = '/login'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105"
              >
                {t('navbar.startUsing')}
              </Button>
            )}

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  currentPage === 'home' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.home')}
              </Link>
              <Link 
                href="/pricing" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  currentPage === 'pricing' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.pricing')}
              </Link>
              <Link 
                href="/about" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                  currentPage === 'about' 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.aboutUs')}
              </Link>

              {user && (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    个人空间
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut()
                      setIsMenuOpen(false)
                    }}
                    className="text-sm font-medium transition-colors hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 text-left"
                  >
                    退出登录
                  </button>
                </>
              )}
              <Button 
                onClick={() => {
                  window.location.href = user ? '/upload' : '/login'
                  setIsMenuOpen(false)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-all duration-300 transform hover:scale-105 w-full"
              >
                {t('navbar.startUsing')}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 