import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envVars = {
      API_302AI_KEY: process.env.API_302AI_KEY ? '已设置' : '未设置',
      API_302AI_BASE_URL: process.env.API_302AI_BASE_URL ? '已设置' : '未设置',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '已设置' : '未设置',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '已设置' : '未设置',
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '环境变量检查失败',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 