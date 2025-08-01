import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createPaymentIntent } from '@/lib/stripe-server';

export async function POST(request: NextRequest) {
  try {
    const { amount, planId, planName }: any = await request.json();

    // 验证用户身份
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    // 验证金额
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 },
      );
    }

    // 创建支付意图
    const paymentIntent = await createPaymentIntent({
      amount,
      currency: 'usd',
      metadata: {
        userId: user.id,
        planId: planId || '',
        planName: planName || '',
        type: 'credit_purchase',
      },
    });

    // 保存到数据库
    const { error: dbError } = await supabase
      .from('bg_stripe_payment_intents')
      .insert({
        id: paymentIntent.id,
        user_id: user.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        metadata: paymentIntent.metadata,
        created_at: new Date(paymentIntent.created * 1000).toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // 即使数据库保存失败，也返回支付意图，因为Stripe已经创建了
    }

    if (dbError) {
      console.error('Database error:', dbError);
      // 即使数据库保存失败，也返回支付意图，因为Stripe已经创建了
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
} 