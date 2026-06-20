"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import DownloadButton from "@/components/invoice/DownloadButton";
import type { InvoiceRecord, Profile } from "@/types/database";
import type { InvoiceSchema } from "@/lib/invoice-schema";
import { ArrowLeft, Loader2 } from "lucide-react";
import ShareImageButton from "@/components/invoice/ShareImageButton";
import { computeInvoice } from "@/lib/invoice-utils";

export default function ViewInvoicePage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      Promise.all([
        fetch(`/api/invoices/${params.id}`).then((r) => r.json()),
        fetch("/api/profile").then((r) => r.json()),
      ]).then(([inv, prof]) => {
        setInvoice(inv);
        setProfile(prof);
        setLoading(false);
      });
    }
  }, [status, params.id]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-400">Invoice not found</p>
      </main>
    );
  }

  // Convert saved record back into the form schema shape
  const invoiceData: InvoiceSchema = {
    clientName: invoice.client_name,
    clientContact: invoice.client_contact,
    invoiceNumber: invoice.invoice_number,
    invoiceDate: invoice.invoice_date,
    items: invoice.items,
    amountReceived: invoice.amount_received,
    businessName: profile?.business_name,
    businessPhone: profile?.business_phone,
    colorTheme: "indigo",
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 transition">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-gray-900">{invoice.invoice_number}</h1>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
        <div className="overflow-x-auto">
          <InvoicePreview
            data={invoiceData}
            logoUrl={profile?.logo_url}
            signatureUrl={profile?.signature_url}
          />
        </div>
        <DownloadButton
          data={invoiceData}
          logoUrl={profile?.logo_url}
          signatureUrl={profile?.signature_url}
        />
        <ShareImageButton
          targetId="invoice-preview"
          fileName={`invoice-${invoiceData.invoiceNumber}`}
          clientPhone={invoiceData.clientContact}
        />
      </div>
    </main>
  );
}