"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import InvoiceForm, { baseDefaults } from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import DownloadButton from "@/components/invoice/DownloadButton";
import ShareImageButton from "@/components/invoice/ShareImageButton";
import type { InvoiceSchema } from "@/lib/invoice-schema";
import { ArrowLeft, FileText, Eye } from "lucide-react";

export default function FreeInvoicePage() {
  const [invoiceData, setInvoiceData] = useState<InvoiceSchema>(baseDefaults);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const handleChange = useCallback((data: InvoiceSchema) => {
    setInvoiceData(data);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-700 transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Free Invoice</h1>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          Not Saved
        </span>
      </header>

      {/* Mobile Tab Switcher */}
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
          <p className="text-sm text-gray-500 font-medium hidden lg:block">
            Fill Invoice Details
          </p>
          <InvoiceForm onChange={handleChange} />
        </div>

        <div className={`space-y-4 ${mobileTab === "form" ? "hidden lg:block" : ""}`}>
          <p className="text-sm text-gray-500 font-medium hidden lg:block">
            Live Preview
          </p>
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="overflow-x-auto">
              <InvoicePreview data={invoiceData} />
            </div>
            <DownloadButton data={invoiceData} />
            <ShareImageButton
              targetId="invoice-preview"
              fileName={`invoice-${invoiceData.invoiceNumber}`}
              clientPhone={invoiceData.clientContact}
            />
          </div>
        </div>
      </div>
    </main>
  );
}