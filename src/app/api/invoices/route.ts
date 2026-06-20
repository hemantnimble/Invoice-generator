import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-server";

// GET — list all invoices for logged in user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST — create new invoice
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Check if an invoice with this number already exists for this user
  const { data: existing } = await supabaseAdmin
    .from("invoices")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("invoice_number", body.invoiceNumber)
    .single();

  const payload = {
    user_id: session.user.id,
    invoice_number: body.invoiceNumber,
    client_name: body.clientName,
    client_contact: body.clientContact,
    invoice_date: body.invoiceDate,
    items: body.items,
    sub_total: body.subTotal,
    total: body.total,
    amount_received: body.amountReceived,
    balance: body.balance,
    status: body.balance <= 0 ? "paid" : body.amountReceived > 0 ? "partial" : "unpaid",
  };

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("invoices")
      .update(payload)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabaseAdmin
    .from("invoices")
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}