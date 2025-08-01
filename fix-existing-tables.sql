-- 修复现有表结构
-- 直接在现有表上添加缺失的列和约束

-- 1. 修复 bg_credit_packages 表
-- 添加 description 列（如果不存在）
ALTER TABLE bg_credit_packages 
ADD COLUMN IF NOT EXISTS description TEXT;

-- 更新现有记录的 description
UPDATE bg_credit_packages 
SET description = '适合轻度使用的用户' 
WHERE name = '基础版' AND (description IS NULL OR description = '');

UPDATE bg_credit_packages 
SET description = '适合中度使用的用户' 
WHERE name = '标准版' AND (description IS NULL OR description = '');

UPDATE bg_credit_packages 
SET description = '适合重度使用的用户' 
WHERE name = '热门版' AND (description IS NULL OR description = '');

-- 2. 修复 bg_image_processing_logs 表
-- 添加 error_message 列（如果不存在）
ALTER TABLE bg_image_processing_logs 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- 确保 original_image_url 不为空
ALTER TABLE bg_image_processing_logs 
ALTER COLUMN original_image_url SET NOT NULL;

-- 设置 credits_used 默认值
ALTER TABLE bg_image_processing_logs 
ALTER COLUMN credits_used SET DEFAULT 1;

-- 3. 修复 bg_credit_transactions 表
-- 更新类型约束
ALTER TABLE bg_credit_transactions 
DROP CONSTRAINT IF EXISTS bg_credit_transactions_type_check;

ALTER TABLE bg_credit_transactions 
ADD CONSTRAINT bg_credit_transactions_type_check 
CHECK (type IN ('recharge', 'consumption', 'refund'));

-- 4. 修复 bg_user_credits 表
-- 确保 credits 有默认值
ALTER TABLE bg_user_credits 
ALTER COLUMN credits SET DEFAULT 0;

-- 5. 创建缺失的索引
CREATE INDEX IF NOT EXISTS idx_bg_user_credits_user_id ON bg_user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_user_id ON bg_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_created_at ON bg_credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_user_id ON bg_image_processing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_status ON bg_image_processing_logs(status);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_created_at ON bg_image_processing_logs(created_at);

-- 6. 启用行级安全策略 (RLS)
ALTER TABLE bg_user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_image_processing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bg_credit_packages ENABLE ROW LEVEL SECURITY;

-- 7. 创建策略（如果不存在）
DROP POLICY IF EXISTS "Allow all operations on bg_user_credits" ON bg_user_credits;
CREATE POLICY "Allow all operations on bg_user_credits" ON bg_user_credits FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on bg_credit_transactions" ON bg_credit_transactions;
CREATE POLICY "Allow all operations on bg_credit_transactions" ON bg_credit_transactions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on bg_image_processing_logs" ON bg_image_processing_logs;
CREATE POLICY "Allow all operations on bg_image_processing_logs" ON bg_image_processing_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on bg_credit_packages" ON bg_credit_packages;
CREATE POLICY "Allow all operations on bg_credit_packages" ON bg_credit_packages FOR ALL USING (true);

-- 8. 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_bg_user_credits_updated_at ON bg_user_credits;
CREATE TRIGGER update_bg_user_credits_updated_at 
    BEFORE UPDATE ON bg_user_credits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. 显示修复结果
SELECT 
    'bg_user_credits' as table_name,
    COUNT(*) as row_count
FROM bg_user_credits
UNION ALL
SELECT 
    'bg_credit_transactions' as table_name,
    COUNT(*) as row_count
FROM bg_credit_transactions
UNION ALL
SELECT 
    'bg_image_processing_logs' as table_name,
    COUNT(*) as row_count
FROM bg_image_processing_logs
UNION ALL
SELECT 
    'bg_credit_packages' as table_name,
    COUNT(*) as row_count
FROM bg_credit_packages;

-- 显示成功消息
SELECT 'Database tables fixed successfully!' as status; 