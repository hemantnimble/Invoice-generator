"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { MessageCircle, Loader2 } from "lucide-react";
import { autoSaveInvoice } from "@/lib/auto-save-invoice";
import type { InvoiceSchema } from "@/lib/invoice-schema";

type Props = {
  targetId: string;
  fileName: string;
  clientPhone: string;
  data?: InvoiceSchema;
  autoSave?: boolean;
};

export default function ShareImageButton({
  targetId,
  fileName,
  clientPhone,
  data,
  autoSave,
}: Props) {
  const [loading, setLoading] = useState(false);

  const cleanPhone = (phone: string) => {
    let digits = phone.replace(/[^\d+]/g, "");
    if (!digits.startsWith("+")) {
      digits = digits.length === 10 ? `91${digits}` : digits;
    } else {
      digits = digits.replace("+", "");
    }
    return digits;
  };

  const handleShare = async () => {
    if (!clientPhone) return;
    setLoading(true);
    try {
      if (autoSave && data) {
        autoSaveInvoice(data); // fire and forget
      }

      const node = document.getElementById(targetId);
      if (!node) return;

      const dataUrl = await toPng(node, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${fileName}.png`;
      a.click();

      const phone = cleanPhone(clientPhone);
      const waUrl = `https://wa.me/${phone}`;

      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 400);
    } catch (err) {
      console.error("Share failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={loading || !clientPhone}
      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-md"
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
      {loading ? "Preparing..." : "Share on WhatsApp"}
    </button>
  );
}