// Fallback values for when environment variables are not available
export const SUPABASE_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://pedantic-black9-vq9cg.supabase.co"
    : process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://pedantic-black9-vq9cg.supabase.co";

export const SUPABASE_ANON_KEY =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFudGljLWJsYWNrOS12cTljZyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE3NTc0NTI1LCJleHAiOjIwMzMxNTA1MjV9.Yd-Oi-Ow-Oa-Oi-Ow-Oa-Oi-Ow-Oa-Oi-Ow-Oa"
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZGFudGljLWJsYWNrOS12cTljZyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE3NTc0NTI1LCJleHAiOjIwMzMxNTA1MjV9.Yd-Oi-Ow-Oa-Oi-Ow-Oa-Oi-Ow-Oa-Oi-Ow-Oa";
