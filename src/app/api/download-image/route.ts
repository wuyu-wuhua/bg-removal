import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: '图片URL是必需的' }, { status: 400 })
    }

    console.log('开始下载图片:', imageUrl)

    // 获取图片
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
      },
      // 添加超时设置
      signal: AbortSignal.timeout(30000) // 30秒超时
    })

    if (!response.ok) {
      console.error('图片下载失败，状态码:', response.status)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    console.log('图片下载成功，大小:', imageBuffer.byteLength, 'bytes')

    // 返回图片数据
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'attachment; filename="background-image.jpg"',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  } catch (error) {
    console.error('下载图片失败:', error)
    
    // 如果是超时错误
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: '下载超时，请稍后重试' }, 
        { status: 408 }
      )
    }
    
    return NextResponse.json(
      { error: '下载图片失败，请检查图片链接是否有效' }, 
      { status: 500 }
    )
  }
}

// 添加OPTIONS方法支持CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 