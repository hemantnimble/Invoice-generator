import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  const amount = plan === "yearly" ? 99900 : 9900; // in paise
  const description = plan === "yearly" ? "Pro Yearly Plan - 365 days" : "Pro Monthly Plan - 30 days";

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      user_id: session.user.id,
      plan,
      email: session.user.email ?? "",
    },
  });

  return NextResponse.json({ orderId: order.id, amount, description });
}