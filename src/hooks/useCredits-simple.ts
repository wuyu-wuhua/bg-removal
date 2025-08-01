'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { createClient } from '@supabase/supabase-js';

interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export function useCreditsSimple() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<UserCredits | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setCredits(null);
      setLoading(false);
      return;
    }

    const fetchCredits = async () => {
      setLoading(true);
      
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('bg_user_credits')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.warn('获取积分失败:', error.message);
        }

        if (data) {
          setCredits(data as UserCredits);
        } else {
          // 如果没有积分记录，创建一个默认记录
          const { data: newCredits, error: createError } = await supabase
            .from('bg_user_credits')
            .insert({
              user_id: user.id,
              credits: 0,
            })
            .select('*')
            .single();

          if (createError) {
            console.warn('创建积分记录失败:', createError.message);
          } else {
            setCredits(newCredits as UserCredits);
          }
        }
      } catch (error) {
        console.warn('积分系统错误:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user?.id]);

  const refresh = () => {
    if (user?.id) {
      const fetchCredits = async () => {
        setLoading(true);
        
        try {
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );

          const { data, error } = await supabase
            .from('bg_user_credits')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.warn('获取积分失败:', error.message);
          }

          if (data) {
            setCredits(data as UserCredits);
          }
        } catch (error) {
          console.warn('积分系统错误:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCredits();
    }
  };

  return {
    credits,
    loading,
    refresh,
  };
} 