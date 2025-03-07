import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./env";

export const createSupabaseClient = () => {
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Client-side singleton
let clientSingleton: ReturnType<typeof createSupabaseClient> | null = null;

export function getSupabaseClient() {
  if (!clientSingleton) {
    clientSingleton = createSupabaseClient();
  }
  return clientSingleton;
}
