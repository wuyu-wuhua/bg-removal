import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

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