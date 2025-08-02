import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { creditSystem } from '@/lib/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('OAuth callback received:', { 
    url: request.url, 
    code: code ? 'present' : 'missing',
    searchParams: Object.fromEntries(requestUrl.searchParams.entries())
  })

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Session exchange result:', { 
      success: !error, 
      error: error?.message,
      user: data?.user?.email 
    })

    // 如果登录成功且是新用户，给予免费积分
    if (data?.user?.id && !error) {
      try {
        // 检查用户是否已有积分记录
        const { data: userCredits } = await supabase
          .from('bg_user_credits')
          .select('user_id')
          .eq('user_id', data.user.id)
          .maybeSingle()

        // 如果没有积分记录，说明是新用户，给予10个免费积分
        if (!userCredits) {
          const addSuccess = await creditSystem.addCredits(data.user.id, 10, '新用户免费积分')
          if (addSuccess) {
            console.log('新用户积分赠送成功:', data.user.id)
          } else {
            console.error('新用户积分赠送失败:', data.user.id)
          }
        }
      } catch (creditError) {
        console.error('检查新用户积分时出错:', creditError)
      }
    }
  }

  // URL to redirect to after sign in process completes
  const redirectUrl = requestUrl.origin + '/'
  console.log('Redirecting to:', redirectUrl)
  
  // 使用HTML页面进行重定向，确保完全刷新
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
      </head>
      <body>
        <script>
          console.log('OAuth callback completed, redirecting to dashboard...');
          window.location.href = '${redirectUrl}';
        </script>
        <p>登录成功，正在跳转...</p>
      </body>
    </html>
  `
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
} 