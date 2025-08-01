import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * 压缩图片到符合302.AI限制的尺寸
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // 计算新的尺寸，确保不超过4,200,000像素
      const maxPixels = 4200000
      const currentPixels = img.width * img.height
      
      let newWidth = img.width
      let newHeight = img.height
      
      if (currentPixels > maxPixels) {
        const ratio = Math.sqrt(maxPixels / currentPixels)
        newWidth = Math.floor(img.width * ratio)
        newHeight = Math.floor(img.height * ratio)
      }
      
      // 设置canvas尺寸
      canvas.width = newWidth
      canvas.height = newHeight
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, newWidth, newHeight)
      
      // 转换为Blob
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        } else {
          resolve(file) // 如果压缩失败，返回原文件
        }
      }, file.type, 0.8) // 80%质量
    }
    
    img.onerror = () => {
      resolve(file) // 如果加载失败，返回原文件
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string

    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID是必需的' },
        { status: 400 }
      )
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只支持图片文件' },
        { status: 400 }
      )
    }

    // 检查文件大小 (限制为10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '文件大小不能超过10MB' },
        { status: 400 }
      )
    }

    // 压缩图片（在服务器端无法使用canvas，所以跳过压缩）
    // 让前端在上传前压缩，或者让302.AI API处理尺寸限制
    const processedFile = file

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `${userId}/${timestamp}-${randomString}.${extension}`

    // 上传到Supabase存储
    const { data, error } = await supabase.storage
      .from('bg-removal-images')
      .upload(fileName, processedFile, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('上传到存储失败:', error)
      return NextResponse.json(
        { error: '上传失败' },
        { status: 500 }
      )
    }

    // 获取公共URL
    const { data: urlData } = supabase.storage
      .from('bg-removal-images')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      imageUrl: urlData.publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('上传错误:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
} 