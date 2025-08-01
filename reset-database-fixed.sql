-- 修复版数据库重置脚本
-- 这个版本会安全地删除现有表，避免错误

-- 首先检查表是否存在，然后删除
DO $$
BEGIN
    -- 删除 bg_image_processing_logs 表
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bg_image_processing_logs') THEN
        DROP TABLE bg_image_processing_logs CASCADE;
        RAISE NOTICE 'Deleted table bg_image_processing_logs';
    ELSE
        RAISE NOTICE 'Table bg_image_processing_logs does not exist';
    END IF;

    -- 删除 bg_credit_transactions 表
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bg_credit_transactions') THEN
        DROP TABLE bg_credit_transactions CASCADE;
        RAISE NOTICE 'Deleted table bg_credit_transactions';
    ELSE
        RAISE NOTICE 'Table bg_credit_transactions does not exist';
    END IF;

    -- 删除 bg_user_credits 表
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bg_user_credits') THEN
        DROP TABLE bg_user_credits CASCADE;
        RAISE NOTICE 'Deleted table bg_user_credits';
    ELSE
        RAISE NOTICE 'Table bg_user_credits does not exist';
    END IF;

    -- 删除 bg_credit_packages 表
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bg_credit_packages') THEN
        DROP TABLE bg_credit_packages CASCADE;
        RAISE NOTICE 'Deleted table bg_credit_packages';
    ELSE
        RAISE NOTICE 'Table bg_credit_packages does not exist';
    END IF;
END $$;

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

-- 显示结果
SELECT 'Database reset completed successfully' as status; 