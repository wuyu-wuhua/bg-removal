'use client'

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@supabase/supabase-js';

interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'recharge' | 'consumption' | 'refund';
  description: string;
  created_at: string;
}

interface DeductCreditsRequest {
  amount: number;
  type: string;
  description?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
}

interface CreditTransactionResponse {
  success: boolean;
  error?: string;
  data: {
    transactionId: string;
    newBalance: number;
  };
}

export function useCredits() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<CreditTransaction[]>([]);

  // 使用 useMemo 来避免每次渲染都创建新的 supabase 客户端
  const supabase = useMemo(() => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // 获取用户积分信息
  const fetchUserCredits = useCallback(async () => {
    if (!user?.id) {
      setCredits(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('bg_user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCredits(data as UserCredits);
      } else {
        // 如果用户没有积分记录，则创建一个初始记录
        const { data: newCredit, error: createError } = await supabase
          .from('bg_user_credits')
          .insert({
            user_id: user.id,
            credits: 0,
          })
          .select('*')
          .single();

        if (createError) {
          console.warn('创建积分记录失败:', createError.message);
          // 不抛出错误，只是记录警告
        } else {
          setCredits(newCredit as UserCredits);
        }
      }
    } catch (err: any) {
      console.warn('获取用户积分失败:', err.message);
      // 不抛出错误，只是记录警告
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // 获取最近交易记录
  const fetchRecentTransactions = useCallback(async () => {
    if (!user?.id) {
      setRecentTransactions([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bg_credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('获取交易记录失败:', error.message);
        return;
      }

      setRecentTransactions(data as CreditTransaction[]);
    } catch (err: any) {
      console.warn('获取交易记录失败:', err.message);
    }
  }, [user?.id]);

  // 初始化数据
  useEffect(() => {
    if (user?.id) {
      fetchUserCredits();
      fetchRecentTransactions();
    } else {
      setCredits(null);
      setRecentTransactions([]);
      setLoading(false);
    }
  }, [user?.id, fetchUserCredits, fetchRecentTransactions]);

  // 刷新数据
  const refresh = useCallback(() => {
    fetchUserCredits();
    fetchRecentTransactions();
  }, [fetchUserCredits, fetchRecentTransactions]);

  // 消费积分
  const deductCredits = useCallback(
    async (request: DeductCreditsRequest): Promise<CreditTransactionResponse> => {
      if (!user?.id) {
        return {
          success: false,
          error: '用户未登录',
          data: { transactionId: '', newBalance: 0 },
        };
      }

      try {
        // 检查积分余额
        if (!credits || credits.credits < request.amount) {
          return {
            success: false,
            error: '积分不足',
            data: { transactionId: '', newBalance: credits?.credits || 0 },
          };
        }

        // 扣除积分
        const { data: updateData, error: updateError } = await supabase
          .from('bg_user_credits')
          .update({ 
            credits: credits.credits - request.amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .select('*')
          .single();

        if (updateError) {
          throw updateError;
        }

        // 记录交易
        const { data: transactionData, error: transactionError } = await supabase
          .from('bg_credit_transactions')
          .insert({
            user_id: user.id,
            amount: -request.amount,
            type: 'consumption',
            description: request.description || '积分消费',
          })
          .select('*')
          .single();

        if (transactionError) {
          throw transactionError;
        }

        // 更新本地状态
        setCredits(updateData as UserCredits);
        refresh();

        return {
          success: true,
          data: {
            transactionId: transactionData.id,
            newBalance: updateData.credits,
          },
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
          data: { transactionId: '', newBalance: credits?.credits || 0 },
        };
      }
    },
    [user?.id, credits, supabase, refresh],
  );

  return {
    credits,
    loading,
    recentTransactions,
    deductCredits,
    refresh,
  };
} 