-- 创建支付相关数据库表
-- 请在Supabase SQL编辑器中执行此脚本

-- 1. 用户积分表
CREATE TABLE IF NOT EXISTS bg_user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 积分交易记录表
CREATE TABLE IF NOT EXISTS bg_credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('recharge', 'consumption', 'refund')),
    description TEXT,
    reference_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Stripe支付意图表
CREATE TABLE IF NOT EXISTS stripe_payment_intents (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bg_user_credits_user_id ON bg_user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_user_id ON bg_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_payment_intents_user_id ON stripe_payment_intents(user_id);

-- 启用行级安全策略 (RLS)
ALTER TABLE bg_user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_payment_intents ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许所有操作，实际项目中应该更严格）
CREATE POLICY "Allow all operations on bg_user_credits" ON bg_user_credits FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_credit_transactions" ON bg_credit_transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on stripe_payment_intents" ON stripe_payment_intents FOR ALL USING (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bg_user_credits_updated_at 
    BEFORE UPDATE ON bg_user_credits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_payment_intents_updated_at 
    BEFORE UPDATE ON stripe_payment_intents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 