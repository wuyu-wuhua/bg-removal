import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 强制动态渲染，禁用缓存
export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '用户ID是必需的' },
        { status: 400 }
      )
    }

    // 获取用户交易历史
    const { data: transactions, error } = await supabase
      .from('bg_credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50) // 限制返回最近50条记录

    if (error) {
      console.error('获取用户交易历史错误:', error)
      return NextResponse.json(
        { success: false, error: '获取交易历史失败' },
        { status: 500 }
      )
    }

    const response = NextResponse.json({
      success: true,
      transactions: transactions || [],
      timestamp: new Date().toISOString()
    })
    
    // 添加响应头禁用缓存
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('获取用户交易历史API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 