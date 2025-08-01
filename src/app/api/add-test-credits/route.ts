import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { creditSystem } from '@/lib/database'

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, credits = 10 } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID是必需的' },
        { status: 400 }
      )
    }

    // 添加测试积分
    const success = await creditSystem.addCredits(userId, credits, '测试积分')
    
    if (success) {
      const balance = await creditSystem.getBalance(userId)
      return NextResponse.json({
        success: true,
        message: `成功添加 ${credits} 积分`,
        newBalance: balance
      })
    } else {
      return NextResponse.json(
        { error: '添加积分失败' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Add test credits error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 