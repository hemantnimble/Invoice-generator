import { supabaseAdmin } from "./supabase-server";

export async function getUserProfile(userId: string) {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}

export async function isUserSubscribed(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  if (!profile) return false;
  if (!profile.is_subscribed) return false;
  if (profile.subscription_end) {
    return new Date(profile.subscription_end) > new Date();
  }
  return profile.is_subscribed;
}

export async function getUserInvoiceCount(userId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  return count ?? 0;
}

export async function canUserSaveInvoice(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  count?: number;
  limit?: number;
}> {
  const subscribed = await isUserSubscribed(userId);
  if (subscribed) return { allowed: true };

  const count = await getUserInvoiceCount(userId);
  const FREE_LIMIT = 5;

  if (count >= FREE_LIMIT) {
    return {
      allowed: false,
      reason: "free_limit_reached",
      count,
      limit: FREE_LIMIT,
    };
  }

  return { allowed: true, count, limit: FREE_LIMIT };
}