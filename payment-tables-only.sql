-- 支付系统新表创建语句
-- 请在Supabase SQL编辑器中执行此脚本

-- 1. Stripe支付意图表
CREATE TABLE IF NOT EXISTS bg_stripe_payment_intents (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 支付记录表
CREATE TABLE IF NOT EXISTS bg_payment_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    stripe_payment_intent_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL,
    plan_id TEXT,
    plan_name TEXT,
    credits_added INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bg_stripe_payment_intents_user_id ON bg_stripe_payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_stripe_payment_intents_status ON bg_stripe_payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_bg_payment_records_user_id ON bg_payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_payment_records_stripe_id ON bg_payment_records(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bg_payment_records_status ON bg_payment_records(status);

-- 启用行级安全策略 (RLS)
ALTER TABLE bg_stripe_payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_payment_records ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许所有操作，实际项目中应该更严格）
CREATE POLICY "Allow all operations on bg_stripe_payment_intents" ON bg_stripe_payment_intents FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_payment_records" ON bg_payment_records FOR ALL USING (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bg_stripe_payment_intents_updated_at 
    BEFORE UPDATE ON bg_stripe_payment_intents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bg_payment_records_updated_at 
    BEFORE UPDATE ON bg_payment_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 