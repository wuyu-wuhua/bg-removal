import { supabase } from '@/lib/supabase';


export async function consumeCreditsForImageEdit(
  userId: string,
  featureType: string,
  creditCost: number,
): Promise<{ success: boolean; message?: string; transactionId?: string }> {
  try {

    // 检查用户积分余额
    const { data: userCredits, error: creditError } = await supabase
      .from('bg_user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (creditError) {
      throw new Error('获取用户积分失败');
    }

    if (!userCredits || userCredits.credits < creditCost) {
      return {
        success: false,
        message: '积分不足，请先充值',
      };
    }

    // 扣除积分
    const { data: updateData, error: updateError } = await supabase
      .from('bg_user_credits')
      .update({ 
        credits: userCredits.credits - creditCost,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    // 记录交易
    const { data: transactionData, error: transactionError } = await supabase
      .from('bg_credit_transactions')
      .insert({
        user_id: userId,
        amount: -creditCost,
        type: 'consumption',
        description: `图片处理: ${featureType}`,
      })
      .select('*')
      .single();

    if (transactionError) {
      throw transactionError;
    }

    return {
      success: true,
      transactionId: transactionData.id,
    };
  } catch (error) {
    console.error('消费积分失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '消费积分失败',
    };
  }
}

export async function addCreditsForPurchase(
  userId: string,
  amount: number,
  planName: string,
  paymentIntentId: string,
): Promise<{ success: boolean; message?: string; transactionId?: string }> {
  try {

    // 获取当前积分
    const { data: userCredits, error: creditError } = await supabase
      .from('bg_user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (creditError && creditError.code !== 'PGRST116') {
      throw new Error('获取用户积分失败');
    }

    const currentCredits = userCredits?.credits || 0;
    const newCredits = currentCredits + amount;

    // 更新或创建积分记录
    const { data: updateData, error: updateError } = await supabase
      .from('bg_user_credits')
      .upsert({
        user_id: userId,
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    // 记录充值交易
    const { data: transactionData, error: transactionError } = await supabase
      .from('bg_credit_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        type: 'recharge',
        description: `充值积分: ${planName}`,
      })
      .select('*')
      .single();

    if (transactionError) {
      throw transactionError;
    }

    return {
      success: true,
      transactionId: transactionData.id,
    };
  } catch (error) {
    console.error('添加积分失败:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '添加积分失败',
    };
  }
} 