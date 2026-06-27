import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  // Verify webhook signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  // Handle subscription cancelled/expired
  if (
    event.event === "subscription.cancelled" ||
    event.event === "subscription.expired"
  ) {
    const subscriptionId = event.payload.subscription.entity.id;

    await supabaseAdmin
      .from("profiles")
      .update({
        is_subscribed: false,
        subscription_plan: null,
        subscription_end: null,
        razorpay_subscription_id: null,
      })
      .eq("razorpay_subscription_id", subscriptionId);
  }

  // Handle subscription renewed — extend end date
  if (event.event === "subscription.charged") {
    const subscriptionId = event.payload.subscription.entity.id;
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("subscription_plan, subscription_end")
      .eq("razorpay_subscription_id", subscriptionId)
      .single();

    if (profile) {
      const currentEnd = profile.subscription_end
        ? new Date(profile.subscription_end)
        : new Date();
      const newEnd =
        profile.subscription_plan === "yearly"
          ? new Date(currentEnd.setFullYear(currentEnd.getFullYear() + 1))
          : new Date(currentEnd.setMonth(currentEnd.getMonth() + 1));

      await supabaseAdmin
        .from("profiles")
        .update({ subscription_end: newEnd.toISOString() })
        .eq("razorpay_subscription_id", subscriptionId);
    }
  }

  return NextResponse.json({ received: true });
}