// Fallback values for when environment variables are not available
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-id.supabase.co";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";
