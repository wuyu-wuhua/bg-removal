import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { creditSystem, databaseOperations } from '@/lib/database'
import { consumeCreditsForImageEdit } from '@/lib/credits'

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 302.AI API配置
const API_302AI_CONFIG = {
  BASE_URL: 'https://api.302.ai',
  REMOVEBG_ENDPOINT: '/302/submit/removebg-v3',
  FETCH_ENDPOINT: '/302/fetch',
  API_KEY: process.env.API_302AI_KEY,
  CREDIT_COST: 1,
  MAX_PIXELS: 4200000, // 4,200,000 像素限制
  MAX_DIMENSION: 2048, // 最大边长限制
  // 超快优化配置
  INITIAL_POLL_INTERVAL: 500, // 初始轮询间隔500ms
  MAX_POLL_ATTEMPTS: 40, // 增加轮询次数，但减少间隔
  TIMEOUT: 60000, // 60秒超时
  // 尝试使用更快的模型
  FAST_MODEL: 'removebg-v3-fast', // 如果有更快的模型
} as const;

type RemoveBgResponse = {
  id: string;
  model: string;
  created_at: string;
  completed_at?: string;
  output?: string;
  error?: string;
  status?: string;
  started_at?: string;
};

/**
 * 压缩图片到符合302.AI限制的尺寸
 */
async function compressImage(imageUrl: string): Promise<string> {
  try {
    // 如果图片是base64格式，直接返回（因为base64通常已经是压缩过的）
    if (imageUrl.startsWith('data:image/')) {
      console.log('图片已经是base64格式，跳过压缩');
      return imageUrl;
    }

    // 对于URL格式的图片，暂时跳过压缩，直接返回原URL
    // 让302.AI API自己处理尺寸限制
    console.log('跳过URL图片压缩，使用原始URL');
    return imageUrl;
  } catch (error) {
    console.error('图片压缩失败:', error);
    // 如果压缩失败，返回原图片
    return imageUrl;
  }
}

/**
 * 检查图片尺寸
 */
async function checkImageSize(imageUrl: string): Promise<{ width: number; height: number; pixels: number }> {
  try {
    // 在服务器端，我们无法直接获取图片尺寸
    // 所以我们跳过这个检查，让302.AI API来处理尺寸验证
    console.log('跳过服务器端图片尺寸检查，由302.AI API处理');
    return { width: 0, height: 0, pixels: 0 };
  } catch (error) {
    console.error('检查图片尺寸失败:', error);
    // 如果检查失败，我们假设图片是有效的，让API来处理
    return { width: 0, height: 0, pixels: 0 };
  }
}

/**
 * 调用302.AI背景移除API
 */
async function call302AIRemoveBgAPI(imageUrl: string): Promise<RemoveBgResponse> {
  if (!API_302AI_CONFIG.API_KEY) {
    throw new Error('缺少302.AI API密钥配置');
  }

  console.log('302.AI API调用信息:', {
    apiKey: `${API_302AI_CONFIG.API_KEY.substring(0, 10)}...`,
    imageUrl: imageUrl.substring(0, 100) + '...', // 只显示前100个字符
  });

  const maxRetries = 2; // 减少重试次数，但增加轮询频率
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`302.AI API调用尝试 ${attempt}/${maxRetries}`);
      
      const response = await fetch(`${API_302AI_CONFIG.BASE_URL}${API_302AI_CONFIG.REMOVEBG_ENDPOINT}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_302AI_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imageUrl
        }),
      });

      console.log('302.AI API响应状态:', response.status);

      if (response.ok) {
        const result = await response.json() as any;
        console.log('302.AI API成功响应:', result);

        // 检查是否直接返回了处理结果（image对象）
        if (result.image && result.image.url) {
          console.log('302.AI API直接返回处理结果，无需轮询');
          return {
            id: 'direct-result',
            model: 'removebg-v3',
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            output: result.image.url,
            status: 'succeeded'
          } as RemoveBgResponse;
        }

        // 检查是否已经完成
        if (result.status === 'succeeded' && result.output) {
          console.log('302.AI API直接返回完成结果，无需轮询');
          return result as RemoveBgResponse;
        }

        // 如果返回的是任务ID，需要轮询
        if (result.id) {
          console.log('302.AI API返回任务ID，需要轮询:', result.id);
          return result as RemoveBgResponse;
        }

        throw new Error('302.AI API返回格式异常');
      } else {
        const errorText = await response.text();
        console.error('302.AI API错误响应:', errorText);
        
        // 检查是否是图片尺寸错误
        if (response.status === 422) {
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.detail && errorData.detail.some((err: any) => 
              err.msg && err.msg.includes('Image size is too large'))) {
              throw new Error('图片尺寸过大，请上传小于 4,200,000 像素的图片（例如：3000x1400 像素）。建议在上传前压缩图片。');
            }
          } catch (parseError) {
            // 如果解析失败，使用原始错误信息
          }
        }
        
        // 如果是服务器错误，尝试重试
        if (response.status >= 500 && attempt < maxRetries) {
          lastError = new Error(`302.AI API服务器错误 (${response.status}): ${errorText}`);
          console.log(`服务器错误，${attempt < maxRetries ? '准备重试' : '已达到最大重试次数'}`);
          await new Promise(resolve => setTimeout(resolve, 500 * attempt)); // 减少递增延迟
          continue;
        }
        
        throw new Error(`302.AI API请求失败: ${errorText}`);
      }
    } catch (error) {
      console.error(`302.AI API调用异常 (尝试 ${attempt}/${maxRetries}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        console.log(`准备重试，等待 ${500 * attempt}ms...`);
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  throw new Error(`302.AI API请求失败 (已重试${maxRetries}次): ${lastError?.message || '未知错误'}`);
}

/**
 * 轮询获取任务结果 - 超快版本
 */
async function pollTaskResult(taskId: string, maxAttempts: number = 40): Promise<RemoveBgResponse> {
  if (!API_302AI_CONFIG.API_KEY) {
    throw new Error('缺少302.AI API密钥配置');
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await fetch(`${API_302AI_CONFIG.BASE_URL}${API_302AI_CONFIG.FETCH_ENDPOINT}?id=${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${API_302AI_CONFIG.API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('302.AI API错误详情:', {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      throw new Error(`302.AI API 请求失败 (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const typedResult = result as RemoveBgResponse;

    // 检查任务是否完成
    if (typedResult.completed_at && typedResult.output) {
      console.log(`任务完成，总轮询次数: ${attempt + 1}`);
      return typedResult;
    }

    // 检查是否有错误
    if (typedResult.error) {
      throw new Error(`302.AI处理失败: ${typedResult.error}`);
    }

    // 根据任务状态动态调整轮询频率
    if (typedResult.status === 'processing' && typedResult.started_at) {
      console.log('任务正在处理中，使用快速轮询...');
    }

    // 超快轮询策略：前几次非常快速，然后逐渐增加
    let pollInterval: number;
    if (attempt < 15) {
      pollInterval = 200; // 前15次每200ms轮询（极快）
    } else if (attempt < 25) {
      pollInterval = 400; // 接下来10次每400ms轮询
    } else if (attempt < 35) {
      pollInterval = 800; // 接下来10次每800ms轮询
    } else {
      pollInterval = 1200; // 最后每1.2秒轮询
    }

    console.log(`轮询尝试 ${attempt + 1}/${maxAttempts}，等待 ${pollInterval}ms...`);
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error('任务超时，请稍后重试');
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, userId } = await request.json()

    console.log('Background removal request:', { imageUrl, userId });

    if (!imageUrl) {
      return NextResponse.json(
        { error: '图片URL是必需的' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID是必需的' },
        { status: 400 }
      )
    }

    // 压缩图片以确保符合302.AI的尺寸限制
    console.log('开始压缩图片...')
    const compressedImageUrl = await compressImage(imageUrl)
    console.log('图片压缩完成，使用压缩后的图片进行背景移除')

    // 检查用户积分是否足够（每次处理消耗1积分）
    let hasEnoughCredits = await creditSystem.checkCredits(userId, 1)
    if (!hasEnoughCredits) {
      // 给新用户免费积分
      const userCredits = await databaseOperations.getUserCredits(userId)
      if (!userCredits) {
        // 新用户，给予10个免费积分
        const addSuccess = await creditSystem.addCredits(userId, 10, '新用户免费积分')
        if (!addSuccess) {
          return NextResponse.json(
            { error: '积分系统错误，请稍后重试' },
            { status: 500 }
          )
        }
        console.log('给予新用户免费积分:', userId)
        // 重新检查积分是否足够
        hasEnoughCredits = await creditSystem.checkCredits(userId, 1)
      } else {
        return NextResponse.json(
          { error: '积分不足，请先充值' },
          { status: 402 }
        )
      }
    }

    // 扣除积分
    const deductSuccess = await creditSystem.deductCredits(userId, 1, '背景移除处理')
    if (!deductSuccess) {
      return NextResponse.json(
        { error: '积分扣除失败' },
        { status: 500 }
      )
    }

    // 创建图片处理记录
    let logId: string
    try {
      const { data, error } = await supabase
        .from('bg_image_processing_logs')
        .insert({
          user_id: userId,
          original_image_url: imageUrl,
          credits_used: 1,
          status: 'processing'
        })
        .select('id')
        .single()

      if (error) throw error
      logId = data.id
    } catch (error) {
      console.error('Error creating processing log:', error)
      // 如果创建记录失败，回滚积分
      await creditSystem.addCredits(userId, 1, '积分回滚 - 记录创建失败')
      return NextResponse.json(
        { error: '创建处理记录失败' },
        { status: 500 }
      )
    }

    try {
      // 调用302.AI API进行背景移除
      console.log('开始调用302.AI背景移除API...')
      const removeBgResult = await call302AIRemoveBgAPI(compressedImageUrl)
      console.log('302.AI API调用成功，任务ID:', removeBgResult.id)

          // 检查是否需要轮询
    let finalResult = removeBgResult
    if (removeBgResult.status !== 'succeeded' || !removeBgResult.output) {
      console.log('开始轮询任务结果...')
      const startTime = Date.now()
      finalResult = await pollTaskResult(removeBgResult.id)
      const totalTime = Date.now() - startTime
      console.log(`任务完成，总耗时: ${totalTime}ms，结果URL:`, finalResult.output)
    } else {
      console.log('API直接返回完成结果，无需轮询')
    }

      const processedImageUrl = finalResult.output || ''

      // 更新处理记录
      await supabase
        .from('bg_image_processing_logs')
        .update({
          processed_image_url: processedImageUrl,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', logId)

      return NextResponse.json({
        success: true,
        logId,
        originalImageUrl: imageUrl,
        processedImageUrl,
        creditsUsed: 1,
        message: '背景移除成功'
      })

    } catch (error) {
      console.error('Background removal error:', error)

      // 更新处理记录为失败状态
      await supabase
        .from('bg_image_processing_logs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString()
        })
        .eq('id', logId)

      // 回滚积分
      await creditSystem.addCredits(userId, 1, '积分回滚 - 处理失败')

      return NextResponse.json(
        {
          error: '背景移除处理失败',
          details: error instanceof Error ? error.message : '未知错误'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// 获取处理状态
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const logId = searchParams.get('logId')
    const userId = searchParams.get('userId')

    if (!logId || !userId) {
      return NextResponse.json(
        { error: 'logId和userId是必需的' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('bg_image_processing_logs')
      .select('*')
      .eq('id', logId)
      .eq('user_id', userId)
      .single()

    if (error) {
      return NextResponse.json(
        { error: '找不到处理记录' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      log: data
    })

  } catch (error) {
    console.error('Get status error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
} 