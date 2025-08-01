# 302.AI API 集成说明

## 概述

本项目已成功集成302.AI的背景移除API，实现了完整的背景移除功能，包括积分系统、用户认证和图片处理记录。

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下环境变量：

```bash
# 302.AI API Configuration
API_302AI_KEY=sk-sxmyz7pjNiW8RzjsaPkJn4JTw6KZrArxmZjGbv0zGMqrmORl
API_302AI_BASE_URL=https://api.302.ai

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lzhygldaxzrhqoxjyymc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=postgres://postgres.ruocdffetovshaizmqat:7BrPicebKC5et27I@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 数据库表结构

执行 `database-schema.sql` 文件创建以下表：

1. **`bg_user_credits`** - 用户积分表
2. **`bg_credit_transactions`** - 积分交易记录表
3. **`bg_image_processing_logs`** - 图片处理记录表
4. **`bg_credit_packages`** - 充值套餐表

## API 端点

### 1. 背景移除处理
- **URL**: `POST /api/remove-background`
- **功能**: 处理图片背景移除，扣除积分，记录处理历史
- **请求体**:
  ```json
  {
    "imageUrl": "图片URL",
    "userId": "用户ID"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "logId": "处理记录ID",
    "originalImageUrl": "原图URL",
    "processedImageUrl": "处理后图片URL",
    "creditsUsed": 1,
    "message": "背景移除成功"
  }
  ```

### 2. 环境变量检查
- **URL**: `GET /api/env-check`
- **功能**: 检查环境变量配置状态

### 3. 302.AI API 测试
- **URL**: `GET /api/test-302ai`
- **功能**: 测试302.AI API连接状态

## 功能特性

### 1. 完整的积分系统
- ✅ 用户积分余额管理
- ✅ 积分充值和消费记录
- ✅ 每次背景移除消耗1积分
- ✅ 处理失败时自动回滚积分

### 2. 图片处理记录
- ✅ 完整的处理历史记录
- ✅ 处理状态跟踪（processing/completed/failed）
- ✅ 原图和处理后图片URL存储

### 3. 用户认证集成
- ✅ 与Supabase认证系统集成
- ✅ 用户登录状态检查
- ✅ 用户数据隔离

### 4. 错误处理
- ✅ API错误处理
- ✅ 积分不足提示
- ✅ 处理失败回滚机制
- ✅ 详细的错误日志

## 使用流程

### 1. 用户登录
用户必须先登录才能使用背景移除功能。

### 2. 上传图片
用户可以通过拖拽、点击或粘贴的方式上传图片。

### 3. 背景移除处理
- 点击"移除背景"按钮
- 系统检查用户积分是否足够
- 扣除1积分
- 调用302.AI API进行背景移除
- 显示处理结果

### 4. 下载结果
处理完成后，用户可以下载处理后的图片。

## 测试页面

访问 `http://localhost:3000/test-api` 可以：

1. **检查环境变量配置**
2. **测试302.AI API连接**
3. **查看详细的配置说明**

## 积分套餐

系统预置了3个充值套餐：

1. **基础版**: 100积分 - $9.99
2. **标准版**: 550积分 - $29.99 (包含50奖励积分)
3. **热门版**: 1200积分 - $49.99 (包含200奖励积分)

## 技术实现

### 1. 302.AI API 服务 (`src/lib/api-302ai.ts`)
- 完整的API封装
- 任务提交和结果获取
- 自动轮询等待处理完成
- 错误处理和重试机制

### 2. 数据库操作 (`src/lib/database.ts`)
- 积分系统业务逻辑
- 用户积分管理
- 交易记录处理
- 图片处理日志管理

### 3. API路由 (`src/app/api/remove-background/route.ts`)
- 完整的请求处理流程
- 积分检查和扣除
- 错误处理和回滚
- 处理记录管理

### 4. 前端集成 (`src/app/upload/page.tsx`)
- 用户友好的界面
- 实时处理状态显示
- 错误提示和处理
- 结果展示和下载

## 注意事项

1. **图片URL要求**: 302.AI API需要公开可访问的图片URL，base64格式可能不被支持
2. **API密钥**: 确保API密钥有效且有足够的余额
3. **处理时间**: 背景移除通常需要3-5秒
4. **积分消耗**: 每次处理消耗1积分
5. **错误处理**: 处理失败时会自动回滚积分

## 故障排除

### 1. API连接失败
- 检查API密钥是否正确
- 确认网络连接正常
- 查看API余额是否充足

### 2. 积分不足
- 用户需要先充值积分
- 检查积分余额是否正确

### 3. 图片处理失败
- 确认图片URL可公开访问
- 检查图片格式是否支持
- 查看服务器日志获取详细错误信息

## 下一步计划

1. **图片上传服务**: 实现图片上传到服务器获取公开URL
2. **批量处理**: 支持多张图片批量处理
3. **处理优化**: 优化处理速度和成功率
4. **用户界面**: 进一步优化用户体验 

## 概述

本项目已成功集成302.AI的背景移除API，实现了完整的背景移除功能，包括积分系统、用户认证和图片处理记录。

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下环境变量：

```bash
# 302.AI API Configuration
API_302AI_KEY=sk-sxmyz7pjNiW8RzjsaPkJn4JTw6KZrArxmZjGbv0zGMqrmORl
API_302AI_BASE_URL=https://api.302.ai

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lzhygldaxzrhqoxjyymc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
DATABASE_URL=postgres://postgres.ruocdffetovshaizmqat:7BrPicebKC5et27I@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 数据库表结构

执行 `database-schema.sql` 文件创建以下表：

1. **`bg_user_credits`** - 用户积分表
2. **`bg_credit_transactions`** - 积分交易记录表
3. **`bg_image_processing_logs`** - 图片处理记录表
4. **`bg_credit_packages`** - 充值套餐表

## API 端点

### 1. 背景移除处理
- **URL**: `POST /api/remove-background`
- **功能**: 处理图片背景移除，扣除积分，记录处理历史
- **请求体**:
  ```json
  {
    "imageUrl": "图片URL",
    "userId": "用户ID"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "logId": "处理记录ID",
    "originalImageUrl": "原图URL",
    "processedImageUrl": "处理后图片URL",
    "creditsUsed": 1,
    "message": "背景移除成功"
  }
  ```

### 2. 环境变量检查
- **URL**: `GET /api/env-check`
- **功能**: 检查环境变量配置状态

### 3. 302.AI API 测试
- **URL**: `GET /api/test-302ai`
- **功能**: 测试302.AI API连接状态

## 功能特性

### 1. 完整的积分系统
- ✅ 用户积分余额管理
- ✅ 积分充值和消费记录
- ✅ 每次背景移除消耗1积分
- ✅ 处理失败时自动回滚积分

### 2. 图片处理记录
- ✅ 完整的处理历史记录
- ✅ 处理状态跟踪（processing/completed/failed）
- ✅ 原图和处理后图片URL存储

### 3. 用户认证集成
- ✅ 与Supabase认证系统集成
- ✅ 用户登录状态检查
- ✅ 用户数据隔离

### 4. 错误处理
- ✅ API错误处理
- ✅ 积分不足提示
- ✅ 处理失败回滚机制
- ✅ 详细的错误日志

## 使用流程

### 1. 用户登录
用户必须先登录才能使用背景移除功能。

### 2. 上传图片
用户可以通过拖拽、点击或粘贴的方式上传图片。

### 3. 背景移除处理
- 点击"移除背景"按钮
- 系统检查用户积分是否足够
- 扣除1积分
- 调用302.AI API进行背景移除
- 显示处理结果

### 4. 下载结果
处理完成后，用户可以下载处理后的图片。

## 测试页面

访问 `http://localhost:3000/test-api` 可以：

1. **检查环境变量配置**
2. **测试302.AI API连接**
3. **查看详细的配置说明**

## 积分套餐

系统预置了3个充值套餐：

1. **基础版**: 100积分 - $9.99
2. **标准版**: 550积分 - $29.99 (包含50奖励积分)
3. **热门版**: 1200积分 - $49.99 (包含200奖励积分)

## 技术实现

### 1. 302.AI API 服务 (`src/lib/api-302ai.ts`)
- 完整的API封装
- 任务提交和结果获取
- 自动轮询等待处理完成
- 错误处理和重试机制

### 2. 数据库操作 (`src/lib/database.ts`)
- 积分系统业务逻辑
- 用户积分管理
- 交易记录处理
- 图片处理日志管理

### 3. API路由 (`src/app/api/remove-background/route.ts`)
- 完整的请求处理流程
- 积分检查和扣除
- 错误处理和回滚
- 处理记录管理

### 4. 前端集成 (`src/app/upload/page.tsx`)
- 用户友好的界面
- 实时处理状态显示
- 错误提示和处理
- 结果展示和下载

## 注意事项

1. **图片URL要求**: 302.AI API需要公开可访问的图片URL，base64格式可能不被支持
2. **API密钥**: 确保API密钥有效且有足够的余额
3. **处理时间**: 背景移除通常需要3-5秒
4. **积分消耗**: 每次处理消耗1积分
5. **错误处理**: 处理失败时会自动回滚积分

## 故障排除

### 1. API连接失败
- 检查API密钥是否正确
- 确认网络连接正常
- 查看API余额是否充足

### 2. 积分不足
- 用户需要先充值积分
- 检查积分余额是否正确

### 3. 图片处理失败
- 确认图片URL可公开访问
- 检查图片格式是否支持
- 查看服务器日志获取详细错误信息

## 下一步计划

1. **图片上传服务**: 实现图片上传到服务器获取公开URL
2. **批量处理**: 支持多张图片批量处理
3. **处理优化**: 优化处理速度和成功率
4. **用户界面**: 进一步优化用户体验 