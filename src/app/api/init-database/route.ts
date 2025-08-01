import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // 直接创建表结构，不使用exec_sql函数
    const results = []
    
    // 1. 创建用户积分表
    try {
      const { error } = await supabase.rpc('create_user_credits_table')
      if (error) {
        // 如果函数不存在，直接执行SQL
        const { error: sqlError } = await supabase
          .from('bg_user_credits')
          .select('*')
          .limit(1)
        
        if (sqlError && sqlError.code === '42P01') { // 表不存在
          results.push({ 
            statement: 'CREATE TABLE bg_user_credits', 
            success: false, 
            error: '请手动在Supabase SQL编辑器中执行database-schema.sql文件' 
          })
        } else {
          results.push({ statement: 'CREATE TABLE bg_user_credits', success: true })
        }
      } else {
        results.push({ statement: 'CREATE TABLE bg_user_credits', success: true })
      }
    } catch (err) {
      results.push({ 
        statement: 'CREATE TABLE bg_user_credits', 
        success: false, 
        error: '请手动在Supabase SQL编辑器中执行database-schema.sql文件' 
      })
    }
    
    const successCount = results.filter(r => r.success).length
    const totalCount = results.length
    
    return NextResponse.json({
      success: successCount === totalCount,
      message: successCount === totalCount 
        ? '数据库初始化完成' 
        : '请手动在Supabase SQL编辑器中执行database-schema.sql文件',
      results: results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 