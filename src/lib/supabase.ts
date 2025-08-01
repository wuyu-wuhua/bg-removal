import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzhygldaxzrhqoxjyymc.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aHlnbGRheHpyaHFveGp5eW1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNzMzOTQsImV4cCI6MjA2NDg0OTM5NH0.QpCb6A7UyG9EsOdk30WPovh9fTMM6XkUq_R0aqc_aaM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端Supabase客户端（使用service_role key）
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aHlnbGRheHpyaHFveGp5eW1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTI3MzM5NCwiZXhwIjoyMDY0ODQ5Mzk0fQ.GKRE2H1vIqAX4kG7cj90_vXc7j9T-GdBwXaZ_WDgE3A'

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey) 