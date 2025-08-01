import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 强制动态渲染
export const dynamic = 'force-dynamic'

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

    // 获取用户生成记录
    const { data: generations, error } = await supabase
      .from('bg_image_processing_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50) // 限制返回最近50条记录

    if (error) {
      console.error('获取用户生成记录错误:', error)
      return NextResponse.json(
        { success: false, error: '获取生成记录失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      generations: generations || [],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('获取用户生成记录API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 