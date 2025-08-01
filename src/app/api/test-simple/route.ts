import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.API_302AI_KEY
    const baseUrl = process.env.API_302AI_BASE_URL || 'https://api.302.ai'
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: 'API密钥未设置'
      })
    }

    // 使用最简单的测试图片
    const testUrl = 'https://httpbin.org/image/png'
    
    console.log('Testing with URL:', testUrl)
    
    const response = await fetch(`${baseUrl}/302/submit/removebg-v3`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: testUrl
      })
    });

    console.log('Response status:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        success: true,
        message: 'API连接成功',
        data: data
      })
    } else {
      const errorText = await response.text()
      console.log('Error response:', errorText)
      return NextResponse.json({
        success: false,
        message: `API请求失败: ${response.status}`,
        error: errorText
      }, { status: response.status })
    }

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({
      success: false,
      message: '测试失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
} 