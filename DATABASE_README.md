# Background Removal 项目数据库设计

## 概述

本项目使用 Supabase 作为数据库，与图片上色项目共享同一个数据库实例，但使用不同的表名以避免冲突。

## 数据库表结构

### 1. `bg_user_credits` - 用户积分表
存储用户的积分余额信息。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | UUID | 主键 | PRIMARY KEY |
| user_id | UUID | 用户ID | REFERENCES auth.users(id) |
| credits | INTEGER | 积分余额 | DEFAULT 0 |
| created_at | TIMESTAMP | 创建时间 | DEFAULT now() |
| updated_at | TIMESTAMP | 更新时间 | DEFAULT now() |

### 2. `bg_credit_transactions` - 积分交易记录表
记录所有的积分充值和消费记录。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | UUID | 主键 | PRIMARY KEY |
| user_id | UUID | 用户ID | REFERENCES auth.users(id) |
| amount | INTEGER | 交易金额 | 正数为充值，负数为消费 |
| type | TEXT | 交易类型 | 'recharge' 或 'consumption' |
| description | TEXT | 交易描述 | 可选 |
| created_at | TIMESTAMP | 创建时间 | DEFAULT now() |

### 3. `bg_image_processing_logs` - 图片处理记录表
记录用户的图片处理历史。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | UUID | 主键 | PRIMARY KEY |
| user_id | UUID | 用户ID | REFERENCES auth.users(id) |
| original_image_url | TEXT | 原图URL | 可选 |
| processed_image_url | TEXT | 处理后图片URL | 可选 |
| credits_used | INTEGER | 消耗积分 | NOT NULL |
| status | TEXT | 处理状态 | 'processing', 'completed', 'failed' |
| created_at | TIMESTAMP | 创建时间 | DEFAULT now() |
| completed_at | TIMESTAMP | 完成时间 | 可选 |

### 4. `bg_credit_packages` - 充值套餐表
定义可用的积分充值套餐。

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | UUID | 主键 | PRIMARY KEY |
| name | TEXT | 套餐名称 | NOT NULL |
| credits | INTEGER | 积分数量 | NOT NULL |
| price | DECIMAL(10,2) | 价格 | NOT NULL |
| currency | TEXT | 货币 | DEFAULT 'CNY' |
| is_active | BOOLEAN | 是否激活 | DEFAULT true |
| created_at | TIMESTAMP | 创建时间 | DEFAULT now() |

## 默认数据

### 充值套餐
系统预置了以下充值套餐：

1. **基础版**: 100积分 - $9.99
2. **标准版**: 550积分 - $29.99 (包含50奖励积分)
3. **热门版**: 1200积分 - $49.99 (包含200奖励积分)

## 安全策略

### Row Level Security (RLS)
所有表都启用了 RLS，确保用户只能访问自己的数据：

- 用户只能查看自己的积分余额
- 用户只能查看自己的交易记录
- 用户只能查看自己的图片处理记录
- 所有用户都可以查看充值套餐

### 数据库函数
提供了 `bg_add_user_credits` 函数来安全地管理用户积分，包括：
- 积分余额更新
- 交易记录创建
- 事务一致性保证

## 使用说明

### 1. 创建数据库表
执行 `database-schema.sql` 文件中的所有 SQL 语句来创建表结构。

### 2. 在代码中使用
项目提供了完整的 TypeScript 类型定义和数据库操作函数：

```typescript
import { creditSystem, databaseOperations } from '@/lib/database'

// 检查用户积分
const hasEnoughCredits = await creditSystem.checkCredits(userId, 10)

// 扣除积分
const success = await creditSystem.deductCredits(userId, 10, '图片处理')

// 获取用户余额
const balance = await creditSystem.getBalance(userId)
```

### 3. 积分消费规则
- 每次图片处理消耗 1 积分
- 用户必须先有足够积分才能使用功能
- 所有交易都会记录在 `bg_credit_transactions` 表中

## 注意事项

1. **表名前缀**: 所有表都使用 `bg_` 前缀，避免与图片上色项目冲突
2. **用户认证**: 依赖 Supabase 的 `auth.users` 表进行用户认证
3. **数据备份**: 建议定期备份数据库数据
4. **监控**: 建议监控积分交易和图片处理的使用情况

## 扩展建议

1. **积分过期机制**: 可以添加积分有效期字段
2. **优惠券系统**: 可以创建优惠券表来支持促销活动
3. **批量处理**: 可以支持批量图片处理，按图片数量计费
4. **API 限制**: 可以添加用户每日使用次数限制 