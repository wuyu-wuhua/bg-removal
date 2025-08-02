import { createClient } from '@supabase/supabase-js'
import { 
  UserCredits, 
  CreditTransaction, 
  ImageProcessingLog, 
  CreditPackage,
  DatabaseOperations,
  CreditSystem,
  ApiResponse,
  CreditOperationResponse
} from '@/types/database'

// 创建 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 数据库操作实现
export const databaseOperations: DatabaseOperations = {
  // 用户积分操作
  async getUserCredits(userId: string): Promise<UserCredits | null> {
    const { data, error } = await supabase
      .from('bg_user_credits')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error getting user credits:', error)
      return null
    }

    return data
  },

  async updateUserCredits(userId: string, credits: number): Promise<boolean> {
    try {
      // 先检查用户是否存在
      const { data: existingUser } = await supabase
        .from('bg_user_credits')
        .select('user_id')
        .eq('user_id', userId)
        .maybeSingle()

      if (existingUser) {
        // 用户存在，更新积分
        const { error } = await supabase
          .from('bg_user_credits')
          .update({ credits: credits })
          .eq('user_id', userId)

        if (error) {
          console.error('Error updating user credits:', error)
          return false
        }
      } else {
        // 用户不存在，插入新记录
        const { error } = await supabase
          .from('bg_user_credits')
          .insert({
            user_id: userId,
            credits: credits
          })

        if (error) {
          console.error('Error inserting user credits:', error)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error in updateUserCredits:', error)
      return false
    }
  },

  // 交易记录操作
  async addTransaction(transaction: Omit<CreditTransaction, 'id' | 'created_at'>): Promise<boolean> {
    const { error } = await supabase
      .from('bg_credit_transactions')
      .insert(transaction)

    if (error) {
      console.error('Error adding transaction:', error)
      return false
    }

    return true
  },

  async getUserTransactions(userId: string, limit: number = 50): Promise<CreditTransaction[]> {
    const { data, error } = await supabase
      .from('bg_credit_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting user transactions:', error)
      return []
    }

    return data || []
  },

  // 图片处理记录操作
  async addImageProcessingLog(log: Omit<ImageProcessingLog, 'id' | 'created_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('bg_image_processing_logs')
      .insert(log)
      .select('id')
      .single()

    if (error) {
      console.error('Error adding image processing log:', error)
      throw new Error('Failed to create processing log')
    }

    return data.id
  },

  async updateImageProcessingStatus(
    id: string, 
    status: ImageProcessingLog['status'], 
    processedUrl?: string
  ): Promise<boolean> {
    const updateData: any = { status }
    if (processedUrl) {
      updateData.processed_image_url = processedUrl
    }
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('bg_image_processing_logs')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Error updating image processing status:', error)
      return false
    }

    return true
  },

  async getUserImageLogs(userId: string, limit: number = 50): Promise<ImageProcessingLog[]> {
    const { data, error } = await supabase
      .from('bg_image_processing_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error getting user image logs:', error)
      return []
    }

    return data || []
  },

  // 充值套餐操作
  async getCreditPackages(): Promise<CreditPackage[]> {
    const { data, error } = await supabase
      .from('bg_credit_packages')
      .select('*')
      .order('credits', { ascending: true })

    if (error) {
      console.error('Error getting credit packages:', error)
      return []
    }

    return data || []
  },

  async getActiveCreditPackages(): Promise<CreditPackage[]> {
    const { data, error } = await supabase
      .from('bg_credit_packages')
      .select('*')
      .eq('is_active', true)
      .order('credits', { ascending: true })

    if (error) {
      console.error('Error getting active credit packages:', error)
      return []
    }

    return data || []
  }
}

// 积分系统业务逻辑实现
export const creditSystem: CreditSystem = {
  async checkCredits(userId: string, requiredCredits: number): Promise<boolean> {
    const userCredits = await databaseOperations.getUserCredits(userId)
    // 如果用户没有积分记录，默认有0积分
    const currentCredits = userCredits?.credits || 0
    return currentCredits >= requiredCredits
  },

  async deductCredits(userId: string, credits: number, description?: string): Promise<boolean> {
    const userCredits = await databaseOperations.getUserCredits(userId)
    if (!userCredits || userCredits.credits < credits) {
      return false
    }

    const newBalance = userCredits.credits - credits
    
    // 更新积分
    const updateSuccess = await databaseOperations.updateUserCredits(userId, newBalance)
    if (!updateSuccess) {
      return false
    }

    // 记录交易
    const transactionSuccess = await databaseOperations.addTransaction({
      user_id: userId,
      amount: -credits,
      type: 'consumption',
      description: description || '积分消费'
    })

    return transactionSuccess
  },

  async addCredits(userId: string, credits: number, description?: string): Promise<boolean> {
    try {
      const userCredits = await databaseOperations.getUserCredits(userId)
      const currentCredits = userCredits?.credits || 0
      const newBalance = currentCredits + credits

      // 更新积分
      const updateSuccess = await databaseOperations.updateUserCredits(userId, newBalance)
      if (!updateSuccess) {
        console.error('更新用户积分失败:', userId)
        return false
      }

      // 记录交易
      const transactionSuccess = await databaseOperations.addTransaction({
        user_id: userId,
        amount: credits,
        type: 'recharge',
        description: description || '积分充值'
      })

      if (!transactionSuccess) {
        console.error('记录交易失败:', userId)
        return false
      }

      console.log(`成功为用户 ${userId} 添加 ${credits} 积分，新余额: ${newBalance}`)
      return true
    } catch (error) {
      console.error('添加积分时出错:', error)
      return false
    }
  },

  async getBalance(userId: string): Promise<number> {
    const userCredits = await databaseOperations.getUserCredits(userId)
    return userCredits?.credits || 0
  },

  async getTransactionHistory(userId: string, limit?: number): Promise<CreditTransaction[]> {
    return await databaseOperations.getUserTransactions(userId, limit)
  }
}

// 工具函数
export const creditUtils = {
  // 格式化积分显示
  formatCredits: (credits: number): string => {
    return credits.toLocaleString()
  },

  // 格式化价格显示
  formatPrice: (price: number, currency: string = 'CNY'): string => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency
    }).format(price)
  },

  // 获取积分套餐的性价比
  getValueRatio: (creditPackage: CreditPackage): number => {
    return creditPackage.credits / creditPackage.price
  }
} 