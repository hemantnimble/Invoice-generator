"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check, ArrowLeft, Loader2, Zap } from "lucide-react";

const FEATURES_FREE = [
  "Unlimited invoice creation",
  "PDF download",
  "WhatsApp sharing",
  "All rental types",
  "Color themes",
  "5 saved invoices",
];

const FEATURES_PRO = [
  "Everything in Free",
  "Unlimited saved invoices",
  "Logo & signature upload",
  "Invoice history & dashboard",
  "Priority support",
];

export default function PricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const price = billing === "monthly" ? "₹99" : "₹999";
  const perMonth = billing === "yearly" ? "₹83/mo" : null;

  const handleUpgrade = async () => {
    if (!session) {
      signIn("google", { callbackUrl: "/pricing" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscription/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billing }),
      });

      const { orderId, amount, error } = await res.json();
      if (error) throw new Error(error);

      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderId,
        amount,
        currency: "INR",
        name: "RentalInvoice",
        description: billing === "yearly" ? "Pro Yearly — 365 days" : "Pro Monthly — 30 days",
        image: "/icons/icon-192x192.png",
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/subscription/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: billing,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push("/dashboard?upgraded=true");
          }
        },
        prefill: {
          email: session.user?.email ?? "",
          name: session.user?.name ?? "",
        },
        theme: { color: "#2D3A8C" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout failed:", err);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-gray-700 transition">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2">
          <Image src="/icons/icon-192x192.png" alt="RentalInvoice" width={28} height={28} className="rounded-lg" />
          <h1 className="text-lg font-bold text-gray-900">RentalInvoice</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">Simple, honest pricing</h2>
          <p className="text-gray-500">Start free. Upgrade when you need more.</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${billing === "monthly"
                ? "bg-[#2D3A8C] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${billing === "yearly"
                ? "bg-[#2D3A8C] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            Yearly
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${billing === "yearly" ? "bg-white/20 text-white" : "bg-green-100 text-green-700"
              }`}>
              Save 15%
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-5">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Free</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">₹0</p>
              <p className="text-sm text-gray-400 mt-1">Forever free</p>
            </div>
            <ul className="space-y-2.5">
              {FEATURES_FREE.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={15} className="text-[#4ECBA5] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/invoice/free"
              className="w-full flex items-center justify-center py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#2D3A8C] rounded-2xl shadow p-6 space-y-5 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="bg-[#4ECBA5] text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap size={11} /> Popular
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-200 uppercase tracking-wide">Pro</p>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-bold text-white">{price}</p>
                <p className="text-sm text-indigo-200 mb-1">
                  {billing === "yearly" ? "/year" : "/month"}
                </p>
              </div>
              {perMonth && (
                <p className="text-sm text-[#4ECBA5] mt-0.5 font-medium">{perMonth} billed yearly</p>
              )}
            </div>
            <ul className="space-y-2.5">
              {FEATURES_PRO.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white">
                  <Check size={15} className="text-[#4ECBA5] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#4ECBA5] hover:bg-[#3aab87] disabled:opacity-60 text-white font-bold transition text-sm"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
              {loading ? "Processing..." : session ? "Upgrade to Pro" : "Sign in to Upgrade"}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="font-bold text-gray-900">Frequently Asked Questions</h3>
          {[
            {
              q: "What happens to my invoices if I cancel?",
              a: "Your saved invoices stay safe. You just won't be able to save new ones beyond the 5 free limit.",
            },
            {
              q: "Can I switch between monthly and yearly?",
              a: "Yes — you can upgrade to yearly anytime from your dashboard.",
            },
            {
              q: "Is my payment secure?",
              a: "Yes — payments are processed securely by Razorpay. We never store your card details.",
            },
            {
              q: "Do I need GST for this subscription?",
              a: "Currently no GST invoice is generated for the subscription itself. This may change as we scale.",
            },
          ].map((item) => (
            <div key={item.q} className="space-y-1">
              <p className="text-sm font-semibold text-gray-800">{item.q}</p>
              <p className="text-sm text-gray-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}