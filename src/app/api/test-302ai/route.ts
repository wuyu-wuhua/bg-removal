import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKey = process.env.API_302AI_KEY
    const baseUrl = process.env.API_302AI_BASE_URL || 'https://api.302.ai'
    
    console.log('API Key:', apiKey ? '已设置' : '未设置')
    console.log('Base URL:', baseUrl)
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        message: 'API密钥未设置',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // 测试不同的图片URL
    const testUrls = [
      'https://picsum.photos/400/300',
      'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Test',
      'https://httpbin.org/image/png'
    ];

    let lastError = '';

    for (const testUrl of testUrls) {
      try {
        console.log(`Testing URL: ${testUrl}`);
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

        if (response.ok) {
          const data = await response.json();
          console.log(`Success with URL: ${testUrl}`, data);
          return NextResponse.json({
            success: true,
            message: `302.AI API 连接正常 (使用URL: ${testUrl})`,
            taskId: data.id,
            workingUrl: testUrl,
            timestamp: new Date().toISOString()
          });
        } else {
          const errorText = await response.text();
          console.log(`Failed with URL: ${testUrl}`, { status: response.status, error: errorText });
          lastError = errorText;
        }
      } catch (urlError) {
        console.log(`Error with URL: ${testUrl}`, urlError);
        lastError = urlError instanceof Error ? urlError.message : 'Unknown error';
      }
    }

    return NextResponse.json({
      success: false,
      message: '所有测试URL都失败',
      error: lastError,
      timestamp: new Date().toISOString()
    }, { status: 500 });

  } catch (error) {
    console.error('Test 302.AI API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 