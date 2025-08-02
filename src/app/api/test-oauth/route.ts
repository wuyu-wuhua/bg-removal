import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
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

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return NextResponse.json({ 
        error: '获取用户失败', 
        details: userError.message 
      }, { status: 500 })
    }

    if (!user) {
      return NextResponse.json({ 
        error: '用户未登录' 
      }, { status: 401 })
    }

    // 检查用户积分记录
    const { data: userCredits, error: creditsError } = await supabase
      .from('bg_user_credits')
      .select('user_id, credits')
      .eq('user_id', user.id)
      .maybeSingle()

    if (creditsError) {
      return NextResponse.json({ 
        error: '检查积分记录失败', 
        details: creditsError.message 
      }, { status: 500 })
    }

    // 检查免费积分交易记录
    const { data: freeCreditTransaction, error: transactionError } = await supabase
      .from('bg_credit_transactions')
      .select('id, amount, description, created_at')
      .eq('user_id', user.id)
      .eq('description', '新用户免费积分')
      .maybeSingle()

    if (transactionError) {
      return NextResponse.json({ 
        error: '检查交易记录失败', 
        details: transactionError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      credits: userCredits,
      freeCreditTransaction,
      shouldReceiveFreeCredits: !userCredits && !freeCreditTransaction
    })

  } catch (error) {
    console.error('测试OAuth时出错:', error)
    return NextResponse.json({ 
      error: '服务器错误', 
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 })
  }
} 