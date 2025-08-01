-- 更新现有数据库表结构
-- 如果您想保留现有数据，请执行这个脚本

-- 为 bg_credit_packages 表添加 description 列
ALTER TABLE bg_credit_packages 
ADD COLUMN IF NOT EXISTS description TEXT;

-- 更新现有记录的 description
UPDATE bg_credit_packages 
SET description = '适合轻度使用的用户' 
WHERE name = '基础版' AND description IS NULL;

UPDATE bg_credit_packages 
SET description = '适合中度使用的用户' 
WHERE name = '标准版' AND description IS NULL;

UPDATE bg_credit_packages 
SET description = '适合重度使用的用户' 
WHERE name = '热门版' AND description IS NULL;

-- 为 bg_image_processing_logs 表添加 error_message 列
ALTER TABLE bg_image_processing_logs 
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- 确保所有必需的列都存在
ALTER TABLE bg_image_processing_logs 
ALTER COLUMN original_image_url SET NOT NULL;

ALTER TABLE bg_image_processing_logs 
ALTER COLUMN credits_used SET DEFAULT 1;

-- 更新类型约束
ALTER TABLE bg_credit_transactions 
DROP CONSTRAINT IF EXISTS bg_credit_transactions_type_check;

ALTER TABLE bg_credit_transactions 
ADD CONSTRAINT bg_credit_transactions_type_check 
CHECK (type IN ('recharge', 'consumption', 'refund'));

-- 确保索引存在
CREATE INDEX IF NOT EXISTS idx_bg_user_credits_user_id ON bg_user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_user_id ON bg_credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_credit_transactions_created_at ON bg_credit_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_user_id ON bg_image_processing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_status ON bg_image_processing_logs(status);
CREATE INDEX IF NOT EXISTS idx_bg_image_processing_logs_created_at ON bg_image_processing_logs(created_at); 