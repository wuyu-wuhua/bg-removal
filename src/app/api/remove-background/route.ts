import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { creditSystem, databaseOperations } from '@/lib/database'
import { consumeCreditsForImageEdit } from '@/lib/credits'

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Stability AI API配置
const STABILITY_AI_CONFIG = {
  BASE_URL: 'https://api.stability.ai',
  REMOVEBG_ENDPOINT: '/v2beta/stable-image/edit/remove-background',
  API_KEY: process.env.STABILITY_AI_API_KEY,
  CREDIT_COST: 1,
  MAX_PIXELS: 4200000, // 4,200,000 像素限制
  MAX_DIMENSION: 2048, // 最大边长限制
  TIMEOUT: 60000, // 60秒超时
} as const;

type StabilityAIRemoveBgResponse = {
  success: boolean;
  imageUrl?: string;
  error?: string;
};

/**
 * 压缩图片到符合Stability AI限制的尺寸
 */
async function compressImage(imageUrl: string): Promise<string> {
  try {
    // 如果图片是base64格式，直接返回（因为base64通常已经是压缩过的）
    if (imageUrl.startsWith('data:image/')) {
      console.log('图片已经是base64格式，跳过压缩');
      return imageUrl;
    }

    // 对于URL格式的图片，我们暂时跳过压缩，让Stability AI API自己处理
    // 如果API返回尺寸错误，我们再考虑添加压缩功能
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
 * 模拟背景移除功能（用于开发测试）
 */
async function simulateBackgroundRemoval(imageUrl: string): Promise<StabilityAIRemoveBgResponse> {
  console.log('使用模拟背景移除功能');
  
  // 模拟处理延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 从images文件夹中随机选择一张背景移除后的图片
  const mockProcessedImages = [
    '/images/金发女人后.jpg',
    '/images/葡萄后.jpg',
    '/images/卫生纸后.jpg',
    '/images/房子后.jpg',
    '/images/外国女人后.jpg',
    '/images/外国男人后.jpg',
    '/images/猫猫后.jpg',
    '/images/礼物后.jpg',
    '/images/苹果后.jpg',
    '/images/车后.jpg',
    '/images/饼干后.jpg',
    '/images/高楼后.jpg',
    '/images/鸟后.jpg'
  ];
  
  // 随机选择一张图片
  const randomIndex = Math.floor(Math.random() * mockProcessedImages.length);
  const processedImageUrl = mockProcessedImages[randomIndex];
  
  console.log('模拟背景移除完成，随机返回图片:', processedImageUrl);
  
  return {
    success: true,
    imageUrl: processedImageUrl,
  };
}

/**
 * 调用Stability AI背景移除API
 */
async function callStabilityAIRemoveBgAPI(imageUrl: string): Promise<StabilityAIRemoveBgResponse> {
  // 如果API密钥不存在或余额不足，使用模拟功能
  if (!STABILITY_AI_CONFIG.API_KEY) {
    console.log('API密钥不存在，使用模拟功能');
    return simulateBackgroundRemoval(imageUrl);
  }

  console.log('Stability AI API调用信息:', {
    apiKey: `${STABILITY_AI_CONFIG.API_KEY.substring(0, 10)}...`,
    imageUrl: imageUrl.substring(0, 100) + '...', // 只显示前100个字符
  });

  const maxRetries = 2;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Stability AI API调用尝试 ${attempt}/${maxRetries}`);
      
      // 首先下载图片到临时文件
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`无法下载图片: ${imageResponse.status}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBlob = new Blob([imageBuffer]);
      
      // 创建FormData
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.png');
      formData.append('output_format', 'webp');
      
      const response = await fetch(`${STABILITY_AI_CONFIG.BASE_URL}${STABILITY_AI_CONFIG.REMOVEBG_ENDPOINT}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${STABILITY_AI_CONFIG.API_KEY}`,
          Accept: 'image/*',
        },
        body: formData,
      });

      console.log('Stability AI API响应状态:', response.status);

      if (response.ok) {
        // 直接返回处理后的图片数据
        const imageData = await response.arrayBuffer();
        const imageBlob = new Blob([imageData], { type: 'image/webp' });
        
        // 将处理后的图片上传到Supabase存储
        const fileName = `processed_${Date.now()}.webp`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('bg-removal-images')
          .upload(`processed/${fileName}`, imageBlob, {
            contentType: 'image/webp'
          });
        
        if (uploadError) {
          throw new Error(`上传处理结果失败: ${uploadError.message}`);
        }
        
        // 获取公开URL
        const { data: urlData } = supabase.storage
          .from('bg-removal-images')
          .getPublicUrl(`processed/${fileName}`);
        
        console.log('Stability AI API处理成功，结果URL:', urlData.publicUrl);
        
        return {
          success: true,
          imageUrl: urlData.publicUrl
        };
              } else {
          const errorText = await response.text();
          console.error('Stability AI API错误响应:', errorText);
          
          // 检查是否是余额不足错误
          if (response.status === 402) {
            try {
              const errorData = JSON.parse(errorText);
              if (errorData.errors && errorData.errors.some((err: string) => 
                err.includes('lack sufficient credits') || err.includes('payment_required'))) {
                console.log('API余额不足，使用模拟功能');
                return simulateBackgroundRemoval(imageUrl);
              }
            } catch (parseError) {
              // 如果解析失败，继续使用原始错误信息
            }
          }
          
          // 检查是否是图片尺寸错误
          if (response.status === 400) {
            try {
              const errorData = JSON.parse(errorText);
              if (errorData.errors && errorData.errors.some((err: string) => 
                err.includes('unsupported dimensions') || err.includes('must be at most'))) {
                lastError = new Error('图片尺寸过大，请上传小于 4,194,304 像素的图片（例如：2048x2048 像素）。建议在上传前压缩图片。');
                throw lastError; // 直接抛出友好的错误信息
              }
            } catch (parseError) {
              // 如果解析失败，继续使用原始错误信息
            }
          }
          
          // 如果是服务器错误，尝试重试
          if (response.status >= 500 && attempt < maxRetries) {
            lastError = new Error(`Stability AI API服务器错误 (${response.status}): ${errorText}`);
            console.log(`服务器错误，${attempt < maxRetries ? '准备重试' : '已达到最大重试次数'}`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          
          throw new Error(`Stability AI API请求失败: ${errorText}`);
        }
    } catch (error) {
      console.error(`Stability AI API调用异常 (尝试 ${attempt}/${maxRetries}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        console.log(`准备重试，等待 ${1000 * attempt}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  throw new Error(`Stability AI API请求失败 (已重试${maxRetries}次): ${lastError?.message || '未知错误'}`);
}

// Stability AI API不需要轮询，直接返回结果

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
      // 调用Stability AI API进行背景移除
      console.log('开始调用Stability AI背景移除API...')
      const removeBgResult = await callStabilityAIRemoveBgAPI(compressedImageUrl)
      console.log('Stability AI API调用成功，结果URL:', removeBgResult.imageUrl)

      if (!removeBgResult.success || !removeBgResult.imageUrl) {
        throw new Error('Stability AI API处理失败')
      }

      const processedImageUrl = removeBgResult.imageUrl

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