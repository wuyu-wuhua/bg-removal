// 数据库表类型定义

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number; // 正数为充值，负数为消费
  type: 'recharge' | 'consumption';
  description?: string;
  created_at: string;
}

export interface ImageProcessingLog {
  id: string;
  user_id: string;
  original_image_url?: string;
  processed_image_url?: string;
  credits_used: number;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

// 数据库操作类型
export interface DatabaseOperations {
  // 用户积分操作
  getUserCredits: (userId: string) => Promise<UserCredits | null>;
  updateUserCredits: (userId: string, credits: number) => Promise<boolean>;
  
  // 交易记录操作
  addTransaction: (transaction: Omit<CreditTransaction, 'id' | 'created_at'>) => Promise<boolean>;
  getUserTransactions: (userId: string, limit?: number) => Promise<CreditTransaction[]>;
  
  // 图片处理记录操作
  addImageProcessingLog: (log: Omit<ImageProcessingLog, 'id' | 'created_at'>) => Promise<string>;
  updateImageProcessingStatus: (id: string, status: ImageProcessingLog['status'], processedUrl?: string) => Promise<boolean>;
  getUserImageLogs: (userId: string, limit?: number) => Promise<ImageProcessingLog[]>;
  
  // 充值套餐操作
  getCreditPackages: () => Promise<CreditPackage[]>;
  getActiveCreditPackages: () => Promise<CreditPackage[]>;
}

// 业务逻辑类型
export interface CreditSystem {
  // 检查用户积分是否足够
  checkCredits: (userId: string, requiredCredits: number) => Promise<boolean>;
  
  // 扣除积分
  deductCredits: (userId: string, credits: number, description?: string) => Promise<boolean>;
  
  // 充值积分
  addCredits: (userId: string, credits: number, description?: string) => Promise<boolean>;
  
  // 获取用户积分余额
  getBalance: (userId: string) => Promise<number>;
  
  // 获取用户交易历史
  getTransactionHistory: (userId: string, limit?: number) => Promise<CreditTransaction[]>;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 积分操作响应
export interface CreditOperationResponse {
  success: boolean;
  newBalance: number;
  message: string;
}

// 图片处理请求
export interface ImageProcessingRequest {
  userId: string;
  imageUrl: string;
  creditsRequired: number;
}

// 图片处理响应
export interface ImageProcessingResponse {
  success: boolean;
  logId: string;
  status: ImageProcessingLog['status'];
  message: string;
} 

export interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number; // 正数为充值，负数为消费
  type: 'recharge' | 'consumption';
  description?: string;
  created_at: string;
}

export interface ImageProcessingLog {
  id: string;
  user_id: string;
  original_image_url?: string;
  processed_image_url?: string;
  credits_used: number;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  currency: string;
  is_active: boolean;
  created_at: string;
}

// 数据库操作类型
export interface DatabaseOperations {
  // 用户积分操作
  getUserCredits: (userId: string) => Promise<UserCredits | null>;
  updateUserCredits: (userId: string, credits: number) => Promise<boolean>;
  
  // 交易记录操作
  addTransaction: (transaction: Omit<CreditTransaction, 'id' | 'created_at'>) => Promise<boolean>;
  getUserTransactions: (userId: string, limit?: number) => Promise<CreditTransaction[]>;
  
  // 图片处理记录操作
  addImageProcessingLog: (log: Omit<ImageProcessingLog, 'id' | 'created_at'>) => Promise<string>;
  updateImageProcessingStatus: (id: string, status: ImageProcessingLog['status'], processedUrl?: string) => Promise<boolean>;
  getUserImageLogs: (userId: string, limit?: number) => Promise<ImageProcessingLog[]>;
  
  // 充值套餐操作
  getCreditPackages: () => Promise<CreditPackage[]>;
  getActiveCreditPackages: () => Promise<CreditPackage[]>;
}

// 业务逻辑类型
export interface CreditSystem {
  // 检查用户积分是否足够
  checkCredits: (userId: string, requiredCredits: number) => Promise<boolean>;
  
  // 扣除积分
  deductCredits: (userId: string, credits: number, description?: string) => Promise<boolean>;
  
  // 充值积分
  addCredits: (userId: string, credits: number, description?: string) => Promise<boolean>;
  
  // 获取用户积分余额
  getBalance: (userId: string) => Promise<number>;
  
  // 获取用户交易历史
  getTransactionHistory: (userId: string, limit?: number) => Promise<CreditTransaction[]>;
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 积分操作响应
export interface CreditOperationResponse {
  success: boolean;
  newBalance: number;
  message: string;
}

// 图片处理请求
export interface ImageProcessingRequest {
  userId: string;
  imageUrl: string;
  creditsRequired: number;
}

// 图片处理响应
export interface ImageProcessingResponse {
  success: boolean;
  logId: string;
  status: ImageProcessingLog['status'];
  message: string;
} 