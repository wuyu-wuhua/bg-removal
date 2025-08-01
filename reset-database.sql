-- 重置数据库表结构
-- 请先执行这个脚本删除现有表，然后执行 database-schema.sql

-- 删除现有表（如果存在）
DROP TABLE IF EXISTS bg_image_processing_logs CASCADE;
DROP TABLE IF EXISTS bg_credit_transactions CASCADE;
DROP TABLE IF EXISTS bg_user_credits CASCADE;
DROP TABLE IF EXISTS bg_credit_packages CASCADE;

-- 删除触发器（如果存在）
DROP TRIGGER IF EXISTS update_bg_user_credits_updated_at ON bg_user_credits;

-- 删除函数（如果存在）
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 删除策略（如果存在）
DROP POLICY IF EXISTS "Allow all operations on bg_user_credits" ON bg_user_credits;
DROP POLICY IF EXISTS "Allow all operations on bg_credit_transactions" ON bg_credit_transactions;
DROP POLICY IF EXISTS "Allow all operations on bg_image_processing_logs" ON bg_image_processing_logs;
DROP POLICY IF EXISTS "Allow all operations on bg_credit_packages" ON bg_credit_packages;

-- 删除索引（如果存在）
DROP INDEX IF EXISTS idx_bg_user_credits_user_id;
DROP INDEX IF EXISTS idx_bg_credit_transactions_user_id;
DROP INDEX IF EXISTS idx_bg_credit_transactions_created_at;
DROP INDEX IF EXISTS idx_bg_image_processing_logs_user_id;
DROP INDEX IF EXISTS idx_bg_image_processing_logs_status;
DROP INDEX IF EXISTS idx_bg_image_processing_logs_created_at; 