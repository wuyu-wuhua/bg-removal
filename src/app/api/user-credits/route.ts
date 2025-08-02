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

    // 获取用户积分
    const { data: userCredits, error } = await supabase
      .from('bg_user_credits')
      .select('credits')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('获取用户积分错误:', error)
      return NextResponse.json(
        { success: false, error: '获取积分失败' },
        { status: 500 }
      )
    }

    // 如果用户没有积分记录，返回0
    const credits = userCredits?.credits || 0

    const response = NextResponse.json({
      success: true,
      credits,
      timestamp: new Date().toISOString()
    })
    
    // 添加响应头禁用缓存
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response

  } catch (error) {
    console.error('获取用户积分API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 