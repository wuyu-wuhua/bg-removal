import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface TableResult {
  exists: boolean
  error: string | null
}

interface DatabaseResults {
  [key: string]: TableResult
}

export async function GET() {
  try {
    const results: DatabaseResults = {}
    
    // 检查各个表是否存在
    const tables = [
      'bg_user_credits',
      'bg_credit_transactions', 
      'bg_image_processing_logs',
      'bg_credit_packages'
    ]
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        results[table] = {
          exists: !error || error.code !== '42P01',
          error: error ? error.message : null
        }
      } catch (err) {
        results[table] = {
          exists: false,
          error: err instanceof Error ? err.message : '未知错误'
        }
      }
    }
    
    const allTablesExist = Object.values(results).every(r => r.exists)
    
    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist ? '所有数据库表都存在' : '部分数据库表缺失',
      tables: results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 