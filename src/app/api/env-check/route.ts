import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      database: {
        url: process.env.DATABASE_URL ? '✅ 已配置' : '❌ 未配置',
        hasUrl: !!process.env.DATABASE_URL,
      },
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 已配置' : '❌ 未配置',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 已配置' : '❌ 未配置',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ 已配置' : '❌ 未配置',
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY ? '✅ 已配置' : '❌ 未配置',
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ 已配置' : '❌ 未配置',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? '✅ 已配置' : '❌ 未配置',
        hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
        hasPublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      },
      app: {
        publicUrl: process.env.NEXT_PUBLIC_APP_URL || '未配置',
        serverUrl: process.env.NEXT_SERVER_APP_URL || '未配置',
      }
    };

    // 测试数据库连接
    let dbConnectionTest = '未测试';
    if (envCheck.supabase.hasUrl && envCheck.supabase.hasServiceKey) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        
        // 测试查询用户积分表
        const { data, error } = await supabase
          .from('bg_user_credits')
          .select('count')
          .limit(1);
        
        if (error) {
          dbConnectionTest = `❌ 连接失败: ${error.message}`;
        } else {
          dbConnectionTest = '✅ 连接成功';
        }
      } catch (error) {
        dbConnectionTest = `❌ 连接异常: ${error instanceof Error ? error.message : '未知错误'}`;
      }
    }

    return NextResponse.json({
      success: true,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      envCheck,
      dbConnectionTest,
      recommendations: {
        database: envCheck.database.hasUrl ? '数据库URL已配置' : '请配置DATABASE_URL',
        supabase: envCheck.supabase.hasUrl && envCheck.supabase.hasServiceKey ? 'Supabase配置完整' : '请检查Supabase配置',
        stripe: envCheck.stripe.hasSecretKey && envCheck.stripe.hasPublishableKey ? 'Stripe配置完整' : '请检查Stripe配置',
        webhook: envCheck.stripe.hasWebhookSecret ? 'Webhook密钥已配置' : '请配置STRIPE_WEBHOOK_SECRET',
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 