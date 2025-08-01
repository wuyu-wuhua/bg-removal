// 302.AI API 服务
// 根据API文档：https://api.302.ai/302/submit/removebg-v3

export interface RemoveBgRequest {
  image_url: string;
}

export interface RemoveBgResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string;
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  model: string;
}

export interface FetchResultResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: string;
  error?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  model: string;
}

class API302AI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.API_302AI_BASE_URL || 'https://api.302.ai';
    this.apiKey = process.env.API_302AI_KEY || '';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    console.log('302.AI API Request:', {
      url,
      method: options.method || 'GET',
      headers: { ...defaultHeaders, ...options.headers },
      body: options.body ? JSON.parse(options.body as string) : undefined
    });

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('302.AI API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response;
  }

  /**
   * 提交背景移除任务
   * @param imageUrl 图片URL
   * @returns 任务ID
   */
  async submitRemoveBg(imageUrl: string): Promise<string> {
    try {
      const requestBody: RemoveBgRequest = {
        image_url: imageUrl,
      };

      const response = await this.makeRequest('/302/submit/removebg-v3', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const data: RemoveBgResponse = await response.json();
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }

      return data.id;
    } catch (error) {
      console.error('Submit remove background error:', error);
      throw error;
    }
  }

  /**
   * 使用base64图片提交背景移除任务
   * @param base64Image base64编码的图片
   * @returns 任务ID
   */
  async submitRemoveBgWithBase64(base64Image: string): Promise<string> {
    try {
      const requestBody = {
        image_base64: base64Image,
      };

      const response = await this.makeRequest('/302/submit/removebg-v3', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const data: RemoveBgResponse = await response.json();
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }

      return data.id;
    } catch (error) {
      console.error('Submit remove background with base64 error:', error);
      throw error;
    }
  }

  /**
   * 获取任务结果
   * @param taskId 任务ID
   * @returns 任务结果
   */
  async fetchResult(taskId: string): Promise<FetchResultResponse> {
    try {
      const response = await this.makeRequest(`/302/fetch/${taskId}`, {
        method: 'GET',
      });

      const data: FetchResultResponse = await response.json();
      
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }

      return data;
    } catch (error) {
      console.error('Fetch result error:', error);
      throw error;
    }
  }

  /**
   * 等待任务完成并返回结果 - 超快版本
   * @param taskId 任务ID
   * @param maxWaitTime 最大等待时间（毫秒）
   * @param pollInterval 轮询间隔（毫秒）
   * @returns 处理结果URL
   */
  async waitForResult(
    taskId: string, 
    maxWaitTime: number = 60000, // 60秒
    pollInterval: number = 500   // 500ms
  ): Promise<string> {
    const startTime = Date.now();
    let attemptCount = 0;

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const result = await this.fetchResult(taskId);
        
        if (result.status === 'completed' && result.output) {
          console.log(`任务完成，耗时: ${Date.now() - startTime}ms，总轮询次数: ${attemptCount}`);
          return result.output;
        }
        
        if (result.status === 'failed') {
          throw new Error(`Task failed: ${result.error || 'Unknown error'}`);
        }

        attemptCount++;
        
        // 超快轮询策略：前几次非常快速，然后逐渐增加
        let currentPollInterval: number;
        if (attemptCount <= 15) {
          currentPollInterval = 200; // 前15次每200ms轮询（极快）
        } else if (attemptCount <= 25) {
          currentPollInterval = 400; // 接下来10次每400ms轮询
        } else if (attemptCount <= 35) {
          currentPollInterval = 800; // 接下来10次每800ms轮询
        } else {
          currentPollInterval = 1200; // 最后每1.2秒轮询
        }

        console.log(`轮询尝试 ${attemptCount}，等待 ${currentPollInterval}ms...`);
        await new Promise(resolve => setTimeout(resolve, currentPollInterval));
      } catch (error) {
        console.error('Error while waiting for result:', error);
        throw error;
      }
    }

    throw new Error('Task timeout: Maximum wait time exceeded');
  }

  /**
   * 完整的背景移除流程
   * @param imageUrl 图片URL
   * @returns 处理后的图片URL
   */
  async removeBackground(imageUrl: string): Promise<string> {
    try {
      console.log('Starting background removal for:', imageUrl);
      
      // 1. 提交任务
      const taskId = await this.submitRemoveBg(imageUrl);
      console.log('Task submitted with ID:', taskId);
      
      // 2. 等待结果
      const resultUrl = await this.waitForResult(taskId);
      console.log('Background removal completed:', resultUrl);
      
      return resultUrl;
    } catch (error) {
      console.error('Background removal failed:', error);
      throw error;
    }
  }

  /**
   * 使用base64图片的完整背景移除流程
   * @param base64Image base64编码的图片
   * @returns 处理后的图片URL
   */
  async removeBackgroundWithBase64(base64Image: string): Promise<string> {
    try {
      console.log('Starting background removal with base64 image');
      
      // 1. 提交任务
      const taskId = await this.submitRemoveBgWithBase64(base64Image);
      console.log('Task submitted with ID:', taskId);
      
      // 2. 等待结果
      const resultUrl = await this.waitForResult(taskId);
      console.log('Background removal completed:', resultUrl);
      
      return resultUrl;
    } catch (error) {
      console.error('Background removal with base64 failed:', error);
      throw error;
    }
  }

  /**
   * 检查API连接状态
   * @returns 是否连接正常
   */
  async checkConnection(): Promise<boolean> {
    try {
      // 使用一个简单的测试图片来验证API是否正常工作
      const testImageUrl = 'https://picsum.photos/400/300';
      const taskId = await this.submitRemoveBg(testImageUrl);
      return !!taskId;
    } catch (error) {
      console.error('API connection check failed:', error);
      return false;
    }
  }
}

// 创建单例实例
export const api302AI = new API302AI(); 