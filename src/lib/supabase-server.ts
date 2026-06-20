import { createClient } from "@supabase/supabase-js";

// Use service role for server-side operations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);