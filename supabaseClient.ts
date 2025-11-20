import { createClient } from '@supabase/supabase-js';

// =================================================================
// 🔴 这里是配置文件，请填入你的 Supabase 项目信息
// =================================================================

// 1. 去 https://supabase.com 注册账号并创建一个项目
// 2. 在左侧菜单点击 Settings (齿轮图标) -> API
// 3. 复制 "Project URL" 填入下方 (保留引号)
const SUPABASE_URL: string = 'https://alykwstjwoefnullcwkn.supabase.co';

// 4. 复制 "Project API keys" 下的 "anon" key 填入下方 (保留引号)
const SUPABASE_ANON_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFseWt3c3Rqd29lZm51bGxjd2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzI2OTAsImV4cCI6MjA3OTIwODY5MH0.g5YCL1WI_XnwVlJvK0pTpWBJ-lIr4EZf4wlsW5TXIeM';

// =================================================================

// 检查是否已配置 (如果 URL 还是默认值，则认为未配置)
export const isSupabaseConfigured = 
  SUPABASE_URL !== 'https://YOUR_PROJECT_ID.supabase.co' && 
  SUPABASE_ANON_KEY !== 'YOUR_ANON_KEY';

// 创建 Supabase 客户端
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);