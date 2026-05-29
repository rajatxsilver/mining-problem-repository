import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Service role key — only used server-side in API routes, never exposed to browser
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars. Check .env.local')
}

// Public client — used in browser (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — used only in API routes (bypasses RLS completely)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey, // falls back to anon if service key not set
  { auth: { autoRefreshToken: false, persistSession: false } }
)
