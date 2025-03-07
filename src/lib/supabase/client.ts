import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

// Client-side singleton
let clientSingleton: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseClient() {
  if (!clientSingleton) {
    clientSingleton = createSupabaseClient();
  }
  return clientSingleton;
}
