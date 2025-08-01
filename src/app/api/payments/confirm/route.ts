import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { confirmPayment } from '@/lib/stripe-server';

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId }: any = await request.json();

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

    // 确认支付状态
    const paymentIntent = await confirmPayment(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not completed', status: paymentIntent.status },
        { status: 400 },
      );
    }

    // 根据planId确定积分数量
    const metadata = paymentIntent.metadata;
    const planId = metadata.planId;
    let credits = 0;
    
    switch (planId) {
      case 'basic':
        credits = 100;
        break;
      case 'standard':
        credits = 500;
        break;
      case 'premium':
        credits = 1000;
        break;
      default:
        // 如果没有匹配的套餐，根据金额计算积分（1美元=60积分）
        credits = Math.floor((paymentIntent.amount / 100) * 60);
    }

    // 添加积分到用户账户
    try {
      // 首先检查用户是否已有积分记录
      const { data: existingCredits, error: checkError } = await supabase
        .from('bg_user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();

      let newBalance = credits;
      
      if (existingCredits) {
        // 更新现有积分
        const { data: updateResult, error: updateError } = await supabase
          .from('bg_user_credits')
          .update({ 
            credits: existingCredits.credits + credits,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select('*')
          .single();

        if (updateError) {
          console.error('Error updating credits:', updateError);
          return NextResponse.json(
            { error: 'Failed to update credits' },
            { status: 500 },
          );
        }
        
        newBalance = updateResult.credits;
      } else {
        // 创建新的积分记录
        const { data: createResult, error: createError } = await supabase
          .from('bg_user_credits')
          .insert({
            user_id: user.id,
            credits: credits,
          })
          .select('*')
          .single();

        if (createError) {
          console.error('Error creating credits:', createError);
          return NextResponse.json(
            { error: 'Failed to create credits' },
            { status: 500 },
          );
        }
        
        newBalance = createResult.credits;
      }

      // 记录交易
      const { data: transactionResult, error: transactionError } = await supabase
        .from('bg_credit_transactions')
        .insert({
          user_id: user.id,
          amount: credits,
          type: 'recharge',
          description: `充值积分: ${metadata.planName || '自定义套餐'}`,
          reference_id: paymentIntentId,
          metadata: {
            paymentIntentId,
            planId,
            planName: metadata.planName,
            stripeAmount: paymentIntent.amount,
          },
        })
        .select('*')
        .single();

      if (transactionError) {
        console.error('Error creating transaction:', transactionError);
        return NextResponse.json(
          { error: 'Failed to create transaction' },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        credits,
        transactionId: transactionResult.id,
        message: `成功充值 ${credits} 积分`,
      });
    } catch (error) {
      console.error('Error in credit processing:', error);
      return NextResponse.json(
        { error: 'Failed to process credits' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
} 