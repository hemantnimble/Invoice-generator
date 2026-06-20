"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import type { InvoiceSchema } from "@/lib/invoice-schema";
import { Download } from "lucide-react";

type Props = {
  data: InvoiceSchema;
  logoUrl?: string | null;
  signatureUrl?: string | null;
};

export default function DownloadButton({ data, logoUrl, signatureUrl }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(<InvoicePDF data={data} logoUrl={logoUrl} signatureUrl={signatureUrl} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${data.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
    >
      <Download size={18} />
      {loading ? "Generating PDF..." : "Download Invoice PDF"}
    </button>
  );
}