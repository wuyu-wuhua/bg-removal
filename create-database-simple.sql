-- 简化版数据库创建脚本
-- 执行完 reset-database-fixed.sql 后执行这个

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 图片处理记录表
CREATE TABLE IF NOT EXISTS bg_image_processing_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    original_image_url TEXT NOT NULL,
    processed_image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    credits_used INTEGER NOT NULL DEFAULT 1,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. 充值套餐表
CREATE TABLE IF NOT EXISTS bg_credit_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bg_user_credits_user_id ON bg_user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_user_id ON bg_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_created_at ON bg_credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_user_id ON bg_image_processing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_status ON bg_image_processing_logs(status);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_created_at ON bg_image_processing_logs(created_at);

-- 插入默认充值套餐
INSERT INTO bg_credit_packages (name, description, credits, price, is_active) VALUES
('基础版', '适合轻度使用的用户', 100, 9.99, true),
('标准版', '适合中度使用的用户', 550, 29.99, true),
('热门版', '适合重度使用的用户', 1200, 49.99, true)
ON CONFLICT DO NOTHING;

-- 启用行级安全策略 (RLS)
ALTER TABLE bg_user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_image_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_packages ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许所有操作，实际项目中应该更严格）
CREATE POLICY "Allow all operations on bg_user_credits" ON bg_user_credits FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_credit_transactions" ON bg_credit_transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_image_processing_logs" ON bg_image_processing_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_credit_packages" ON bg_credit_packages FOR ALL USING (true);

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

-- 显示结果
SELECT 'Database tables created successfully' as status; 
-- 执行完 reset-database-fixed.sql 后执行这个

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 图片处理记录表
CREATE TABLE IF NOT EXISTS bg_image_processing_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    original_image_url TEXT NOT NULL,
    processed_image_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    credits_used INTEGER NOT NULL DEFAULT 1,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 4. 充值套餐表
CREATE TABLE IF NOT EXISTS bg_credit_packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bg_user_credits_user_id ON bg_user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_user_id ON bg_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_created_at ON bg_credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_user_id ON bg_image_processing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_status ON bg_image_processing_logs(status);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_created_at ON bg_image_processing_logs(created_at);

-- 插入默认充值套餐
INSERT INTO bg_credit_packages (name, description, credits, price, is_active) VALUES
('基础版', '适合轻度使用的用户', 100, 9.99, true),
('标准版', '适合中度使用的用户', 550, 29.99, true),
('热门版', '适合重度使用的用户', 1200, 49.99, true)
ON CONFLICT DO NOTHING;

-- 启用行级安全策略 (RLS)
ALTER TABLE bg_user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_image_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_packages ENABLE ROW LEVEL SECURITY;

-- 创建策略（允许所有操作，实际项目中应该更严格）
CREATE POLICY "Allow all operations on bg_user_credits" ON bg_user_credits FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_credit_transactions" ON bg_credit_transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_image_processing_logs" ON bg_image_processing_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on bg_credit_packages" ON bg_credit_packages FOR ALL USING (true);

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

-- 显示结果
SELECT 'Database tables created successfully' as status; 