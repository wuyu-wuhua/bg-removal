-- 支付系统数据库表结构
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

-- 3. 用户积分表（如果不存在）
CREATE TABLE IF NOT EXISTS bg_user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE,
    credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 积分交易记录表（如果不存在）
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bg_stripe_payment_intents_user_id ON bg_stripe_payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_stripe_payment_intents_status ON bg_stripe_payment_intents(status);
CREATE INDEX IF NOT EXISTS idx_bg_payment_records_user_id ON bg_payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_payment_records_stripe_id ON bg_payment_records(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bg_payment_records_status ON bg_payment_records(status);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_user_id ON bg_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_type ON bg_credit_transactions(type);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_created_at ON bg_credit_transactions(created_at);

-- 启用行级安全策略 (RLS)
ALTER TABLE bg_stripe_payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_transactions ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许所有操作，实际项目中应该更严格）
CREATE POLICY "Allow all operations on bg_stripe_payment_intents" ON bg_stripe_payment_intents FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_payment_records" ON bg_payment_records FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_user_credits" ON bg_user_credits FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_credit_transactions" ON bg_credit_transactions FOR ALL USING (true);

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

CREATE TRIGGER update_bg_user_credits_updated_at 
    BEFORE UPDATE ON bg_user_credits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 创建积分管理函数
CREATE OR REPLACE FUNCTION add_user_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_type TEXT,
    p_description TEXT,
    p_reference_id TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_transaction_id UUID;
    v_new_balance INTEGER;
BEGIN
    -- 获取或创建用户积分记录
    INSERT INTO bg_user_credits (user_id, credits)
    VALUES (p_user_id, p_amount)
    ON CONFLICT (user_id)
    DO UPDATE SET 
        credits = bg_user_credits.credits + p_amount,
        updated_at = NOW()
    RETURNING credits INTO v_new_balance;

    -- 创建交易记录
    INSERT INTO bg_credit_transactions (
        user_id, 
        amount, 
        type, 
        description, 
        reference_id, 
        metadata
    ) VALUES (
        p_user_id, 
        p_amount, 
        p_type, 
        p_description, 
        p_reference_id, 
        p_metadata
    ) RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'transaction_id', v_transaction_id,
        'new_balance', v_new_balance,
        'amount_added', p_amount
    );
END;
$$ LANGUAGE plpgsql;

-- 创建积分扣除函数
CREATE OR REPLACE FUNCTION deduct_user_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_type TEXT,
    p_description TEXT,
    p_reference_id TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_transaction_id UUID;
    v_new_balance INTEGER;
    v_current_credits INTEGER;
BEGIN
    -- 检查当前积分余额
    SELECT credits INTO v_current_credits
    FROM bg_user_credits
    WHERE user_id = p_user_id;

    IF v_current_credits IS NULL THEN
        RAISE EXCEPTION '用户积分记录不存在';
    END IF;

    IF v_current_credits < p_amount THEN
        RAISE EXCEPTION '积分不足';
    END IF;

    -- 扣除积分
    UPDATE bg_user_credits
    SET 
        credits = credits - p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING credits INTO v_new_balance;

    -- 创建交易记录
    INSERT INTO bg_credit_transactions (
        user_id, 
        amount, 
        type, 
        description, 
        reference_id, 
        metadata
    ) VALUES (
        p_user_id, 
        -p_amount, 
        p_type, 
        p_description, 
        p_reference_id, 
        p_metadata
    ) RETURNING id INTO v_transaction_id;

    RETURN jsonb_build_object(
        'transaction_id', v_transaction_id,
        'new_balance', v_new_balance,
        'amount_deducted', p_amount
    );
END;
$$ LANGUAGE plpgsql; 