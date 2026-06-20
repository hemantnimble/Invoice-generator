"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { MessageCircle, Loader2 } from "lucide-react";

type Props = {
  targetId: string;
  fileName: string;
  clientPhone: string;
  clientName?: string;
  businessName?: string;
  totalAmount?: string;
  balanceAmount?: string;
};

export default function ShareImageButton({
  targetId,
  fileName,
  clientPhone,
  clientName,
  businessName,
  totalAmount,
  balanceAmount,
}: Props) {
  const [loading, setLoading] = useState(false);

  const cleanPhone = (phone: string) => {
    // Strip spaces, dashes, keep only digits and leading +
    let digits = phone.replace(/[^\d+]/g, "");
    // If no country code, assume India (+91)
    if (!digits.startsWith("+")) {
      digits = digits.length === 10 ? `91${digits}` : digits;
    } else {
      digits = digits.replace("+", "");
    }
    return digits;
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const node = document.getElementById(targetId);
      if (!node) return;

      const dataUrl = await toPng(node, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${fileName}.png`, { type: "image/png" });

      const phone = cleanPhone(clientPhone);
      const message = `Hi ${clientName || "there"}, here's your invoice from ${
        businessName || "us"
      }.${totalAmount ? ` Total: ₹${totalAmount}.` : ""}${
        balanceAmount ? ` Balance due: ₹${balanceAmount}.` : ""
      }`;

      // Try native share targeted — opens share sheet, user picks WhatsApp
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: message,
        });
        return;
      }

      // Fallback — download image + open WhatsApp chat with that number
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.png`;
      a.click();
      URL.revokeObjectURL(url);

      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");
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