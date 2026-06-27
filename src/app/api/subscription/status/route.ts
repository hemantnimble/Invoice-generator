import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canUserSaveInvoice, isUserSubscribed, getUserInvoiceCount } from "@/lib/subscription";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [subscribed, count, saveCheck] = await Promise.all([
    isUserSubscribed(session.user.id),
    getUserInvoiceCount(session.user.id),
    canUserSaveInvoice(session.user.id),
  ]);

  return NextResponse.json({
    isSubscribed: subscribed,
    invoiceCount: count,
    freeLimit: 5,
    canSave: saveCheck.allowed,
  });
}