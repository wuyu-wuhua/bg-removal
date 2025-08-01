# 支付系统设置指南

## 环境变量配置

在您的 `.env.local` 文件中添加以下环境变量：

```bash
# Stripe 配置
STRIPE_SECRET_KEY=sk_test_...  # 从 Stripe Dashboard 获取
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # 从 Stripe Dashboard 获取
STRIPE_WEBHOOK_SECRET=whsec_...  # 从 Stripe Dashboard Webhooks 获取

# 其他现有配置保持不变
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
API_302AI_KEY=...
```

## Stripe 设置步骤

### 1. 创建 Stripe 账户
1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 注册账户并完成验证

### 2. 获取 API 密钥
1. 在 Stripe Dashboard 中，进入 "Developers" > "API keys"
2. 复制 "Publishable key" 和 "Secret key"
3. 将测试密钥添加到环境变量中

### 3. 设置 Webhook
1. 在 Stripe Dashboard 中，进入 "Developers" > "Webhooks"
2. 点击 "Add endpoint"
3. 输入您的 webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. 选择以下事件：
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. 复制 webhook 签名密钥并添加到环境变量

## 数据库设置

### 1. 执行数据库脚本
在 Supabase SQL 编辑器中执行 `payment-database-schema.sql` 文件中的脚本。

### 2. 验证表结构
确保以下表已创建：
- `stripe_payment_intents`
- `payment_records`
- `bg_user_credits`
- `bg_credit_transactions`

## 安装依赖

```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js uuid
```

## 功能说明

### 定价套餐
- **基础版**: $9.99 - 100 积分
- **标准版**: $29.99 - 550 积分 (节省 55%)
- **热门版**: $49.99 - 1200 积分 (节省 58%)

### 积分消费
- 每次背景移除处理消耗 1 积分
- 新用户自动获得 10 个免费积分

### 支付流程
1. 用户在定价页面选择套餐
2. 点击购买按钮，弹出支付表单
3. 输入信用卡信息
4. 支付成功后自动添加积分到用户账户
5. 用户可以使用积分进行图片处理

## 测试

### 测试信用卡
Stripe 提供以下测试信用卡：
- 成功支付: `4242 4242 4242 4242`
- 需要验证: `4000 0025 0000 3155`
- 支付失败: `4000 0000 0000 0002`

### 测试步骤
1. 使用测试信用卡完成支付
2. 检查积分是否正确添加
3. 测试图片处理功能
4. 验证积分扣除

## 安全注意事项

1. **环境变量**: 确保生产环境的密钥安全存储
2. **Webhook 验证**: 始终验证 webhook 签名
3. **错误处理**: 实现完善的错误处理和日志记录
4. **数据备份**: 定期备份支付和积分数据

## 故障排除

### 常见问题
1. **支付失败**: 检查 Stripe 密钥配置
2. **积分未添加**: 检查 webhook 配置和数据库连接
3. **Webhook 错误**: 验证签名密钥和 URL 配置

### 日志查看
- 检查浏览器控制台错误
- 查看服务器日志
- 在 Stripe Dashboard 中查看支付记录

## 生产环境部署

1. 切换到 Stripe 生产模式
2. 更新环境变量为生产密钥
3. 配置生产环境 webhook URL
4. 测试完整的支付流程
5. 监控支付和积分系统运行状态 