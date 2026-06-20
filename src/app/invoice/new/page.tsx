"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import DownloadButton from "@/components/invoice/DownloadButton";
import type { InvoiceSchema } from "@/lib/invoice-schema";
import { computeInvoice, generateInvoiceNumber } from "@/lib/invoice-utils";
import { ArrowLeft, FileText, Eye, Save, Loader2, Check } from "lucide-react";
import type { Profile } from "@/types/database";
import ShareImageButton from "@/components/invoice/ShareImageButton";
import InvoiceForm, { baseDefaults } from "@/components/invoice/InvoiceForm";

export default function NewInvoicePage() {
  const { status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceSchema | null>(null);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => setProfile(data));
    }
  }, [status]);

  const handleChange = useCallback((data: InvoiceSchema) => {
    setInvoiceData(data);
  }, []);

  const handleSave = async () => {
    if (!invoiceData) return;
    setSaving(true);
    const computed = computeInvoice(invoiceData);

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(computed),
    });

    setSaving(false);

    if (res.ok) {
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  };

  if (status === "loading" || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </main>
    );
  }

  const defaultValues: InvoiceSchema = {
    ...baseDefaults,
    invoiceNumber: generateInvoiceNumber(),
    businessName: profile.business_name,
    businessPhone: profile.business_phone,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-700 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">New Invoice</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium px-4 py-2 rounded-xl transition text-sm"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Invoice"}
        </button>
      </header>

      {/* Mobile Tabs */}
      <div className="lg:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setMobileTab("form")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileTab === "form" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"
          }`}
        >
          <FileText size={16} /> Fill Details
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
            mobileTab === "preview" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"
          }`}
        >
          <Eye size={16} /> Preview
        </button>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`space-y-4 ${mobileTab === "preview" ? "hidden lg:block" : ""}`}>
          <InvoiceForm onChange={handleChange} defaultValues={defaultValues} />
        </div>

        <div className={`space-y-4 ${mobileTab === "form" ? "hidden lg:block" : ""}`}>
          <div className="lg:sticky lg:top-24 space-y-4">
            <InvoicePreview data={invoiceData ?? defaultValues} logoUrl={profile.logo_url} signatureUrl={profile.signature_url} />
            <DownloadButton data={invoiceData ?? defaultValues} logoUrl={profile.logo_url} signatureUrl={profile.signature_url} />
            <ShareImageButton
              targetId="invoice-preview"
              fileName={`invoice-${(invoiceData ?? defaultValues).invoiceNumber}`}
              clientPhone={(invoiceData ?? defaultValues).clientContact}
            />
          </div>
        </div>
      </div>
    </main>
  );
}