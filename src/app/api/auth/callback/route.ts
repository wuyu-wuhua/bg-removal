import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { creditSystem } from '@/lib/database'

// 简单的翻译函数
const getTranslation = (key: string, lang: 'zh' | 'en' = 'zh') => {
  const translations = {
    zh: {
      newUserFreeCredits: '新用户免费积分',
      redirecting: '正在跳转...',
      loginSuccessRedirecting: '登录成功，正在跳转...',
      checkingNewUserCredits: '检查新用户积分赠送',
      newUserFirstLogin: '新用户首次登录，赠送10积分',
      newUserCreditsCreated: '新用户积分记录创建成功',
      newUserCreditsCompleted: '新用户积分赠送完成',
      oldUserNoCredits: '老用户没有积分记录，创建0积分记录',
      userHasCredits: '用户已有积分记录',
      credits: '积分',
      checkUserCreditsFailed: '检查用户积分记录失败',
      createNewUserCreditsFailed: '创建新用户积分记录失败',
      recordNewUserTransactionFailed: '记录新用户积分交易失败',
      createOldUserCreditsFailed: '创建老用户积分记录失败',
      checkNewUserCreditsError: '检查新用户积分时出错'
    },
    en: {
      newUserFreeCredits: 'New User Free Credits',
      redirecting: 'Redirecting...',
      loginSuccessRedirecting: 'Login successful, redirecting...',
      checkingNewUserCredits: 'Checking new user credit giveaway',
      newUserFirstLogin: 'New user first login, giving 10 credits',
      newUserCreditsCreated: 'New user credit record created successfully',
      newUserCreditsCompleted: 'New user credit giveaway completed',
      oldUserNoCredits: 'Old user has no credit record, creating 0 credit record',
      userHasCredits: 'User already has credit record',
      credits: 'credits',
      checkUserCreditsFailed: 'Failed to check user credit record',
      createNewUserCreditsFailed: 'Failed to create new user credit record',
      recordNewUserTransactionFailed: 'Failed to record new user credit transaction',
      createOldUserCreditsFailed: 'Failed to create old user credit record',
      checkNewUserCreditsError: 'Error checking new user credits'
    }
  }
  return translations[lang][key as keyof typeof translations[typeof lang]] || key
}

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
        console.log(getTranslation('checkingNewUserCredits') + ':', data.user.id)
        
        // 检查用户是否已有积分记录
        const { data: userCredits, error: checkError } = await supabase
          .from('bg_user_credits')
          .select('user_id, credits')
          .eq('user_id', data.user.id)
          .maybeSingle()

        if (checkError) {
          console.error(getTranslation('checkUserCreditsFailed') + ':', checkError)
        }

        // 检查用户是否已经获得过免费积分（通过交易记录判断）
        const { data: freeCreditTransaction } = await supabase
          .from('bg_credit_transactions')
          .select('id')
          .eq('user_id', data.user.id)
          .eq('description', getTranslation('newUserFreeCredits'))
          .maybeSingle()

        const hasReceivedFreeCredits = !!freeCreditTransaction

        // 如果没有积分记录且从未获得过免费积分，给予10个免费积分
        if (!userCredits && !hasReceivedFreeCredits) {
          console.log(getTranslation('newUserFirstLogin') + ':', data.user.id)
          
          // 直接创建积分记录，避免与useCredits hook冲突
          const { data: newCredits, error: createError } = await supabase
            .from('bg_user_credits')
            .insert({
              user_id: data.user.id,
              credits: 10,
            })
            .select('*')
            .single()

          if (createError) {
            console.error(getTranslation('createNewUserCreditsFailed') + ':', createError)
          } else {
            console.log(getTranslation('newUserCreditsCreated') + ':', newCredits)
            
            // 记录交易
            const { error: transactionError } = await supabase
              .from('bg_credit_transactions')
              .insert({
                user_id: data.user.id,
                amount: 10,
                type: 'recharge',
                description: getTranslation('newUserFreeCredits')
              })

            if (transactionError) {
              console.error(getTranslation('recordNewUserTransactionFailed') + ':', transactionError)
            } else {
              console.log(getTranslation('newUserCreditsCompleted') + ':', data.user.id)
            }
          }
        } else if (!userCredits && hasReceivedFreeCredits) {
          // 老用户但没有积分记录，创建0积分记录（避免重复检查）
          console.log(getTranslation('oldUserNoCredits') + ':', data.user.id)
          const { error: createError } = await supabase
            .from('bg_user_credits')
            .insert({
              user_id: data.user.id,
              credits: 0,
            })

          if (createError) {
            console.error(getTranslation('createOldUserCreditsFailed') + ':', createError)
          }
        } else {
          console.log(getTranslation('userHasCredits') + ':', userCredits?.credits || 0, getTranslation('credits'))
        }
      } catch (creditError) {
        console.error(getTranslation('checkNewUserCreditsError') + ':', creditError)
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
        <title>${getTranslation('redirecting')}</title>
      </head>
      <body>
        <script>
          console.log('OAuth callback completed, redirecting to dashboard...');
          window.location.href = '${redirectUrl}';
        </script>
        <p>${getTranslation('loginSuccessRedirecting')}</p>
      </body>
    </html>
  `
  
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
} 