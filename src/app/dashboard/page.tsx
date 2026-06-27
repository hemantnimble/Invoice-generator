"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { InvoiceRecord } from "@/types/database";
import { formatCurrency } from "@/lib/invoice-utils";
import { format } from "date-fns";
import { Loader2, Plus, Trash2, Settings, Eye, Zap } from "lucide-react";
import Image from "next/image";

type SubStatus = {
  isSubscribed: boolean;
  invoiceCount: number;
  freeLimit: number;
  canSave: boolean;
};

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded");
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [subStatus, setSubStatus] = useState<SubStatus | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/invoices").then((r) => r.json()),
        fetch("/api/subscription/status").then((r) => r.json()),
      ]).then(([inv, sub]) => {
        setInvoices(Array.isArray(inv) ? inv : []);
        setSubStatus(sub);
        setLoading(false);
      });
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    setSubStatus((prev) =>
      prev ? { ...prev, invoiceCount: prev.invoiceCount - 1 } : prev
    );
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-[#2D3A8C]" size={28} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 pb-24 lg:pb-8">
      <div className="max-w-4xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/icon-192x192.png"
              alt="RentalInvoice"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-500">
                {invoices.length} saved invoice{invoices.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/settings"
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <Settings size={18} className="text-gray-600" />
            </Link>
            <Link
              href="/invoice/new"
              className="flex items-center gap-2 bg-[#2D3A8C] hover:bg-[#232d6e] text-white font-medium px-4 py-2 rounded-xl transition text-sm"
            >
              <Plus size={16} /> New Invoice
            </Link>
          </div>
        </div>

        {/* Upgrade success banner */}
        {upgraded && (
          <div className="bg-[#edfbf6] border border-[#4ECBA5]/30 rounded-2xl p-4 flex items-center gap-3">
            <Zap size={18} className="text-[#4ECBA5]" />
            <div>
              <p className="font-semibold text-[#047857] text-sm">
                Welcome to Pro! 🎉
              </p>
              <p className="text-xs text-gray-500">
                You now have unlimited invoice saves.
              </p>
            </div>
          </div>
        )}

        {/* Usage / Subscription Status */}
        {subStatus && !subStatus.isSubscribed && (
          <div
            className={`rounded-2xl p-4 flex items-center justify-between gap-4 ${
              subStatus.invoiceCount >= subStatus.freeLimit
                ? "bg-red-50 border border-red-200"
                : "bg-[#eef0fb] border border-[#2D3A8C]/10"
            }`}
          >
            <div className="flex-1">
              <p
                className={`text-sm font-semibold ${
                  subStatus.invoiceCount >= subStatus.freeLimit
                    ? "text-red-700"
                    : "text-[#2D3A8C]"
                }`}
              >
                {subStatus.invoiceCount >= subStatus.freeLimit
                  ? "You've reached the 5 invoice limit"
                  : `${subStatus.invoiceCount} / ${subStatus.freeLimit} free invoices used`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {subStatus.invoiceCount >= subStatus.freeLimit
                  ? "Upgrade to Pro to save unlimited invoices"
                  : `${subStatus.freeLimit - subStatus.invoiceCount} saves remaining on free plan`}
              </p>
              {/* Progress bar */}
              {subStatus.invoiceCount < subStatus.freeLimit && (
                <div className="mt-2 h-1.5 bg-[#2D3A8C]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2D3A8C] rounded-full transition-all"
                    style={{
                      width: `${(subStatus.invoiceCount / subStatus.freeLimit) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 bg-[#2D3A8C] text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap hover:bg-[#232d6e] transition shrink-0"
            >
              <Zap size={12} /> Upgrade
            </Link>
          </div>
        )}

        {subStatus?.isSubscribed && (
          <div className="rounded-2xl p-3 bg-[#edfbf6] border border-[#4ECBA5]/30 flex items-center gap-2">
            <Zap size={14} className="text-[#4ECBA5]" />
            <p className="text-sm font-medium text-[#047857]">
              Pro Plan active — unlimited invoices
            </p>
          </div>
        )}

        {/* Empty state */}
        {invoices.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-400 mb-4">No saved invoices yet</p>
            <Link
              href="/invoice/new"
              className="inline-flex items-center gap-2 bg-[#2D3A8C] hover:bg-[#232d6e] text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
            >
              <Plus size={16} /> Create your first invoice
            </Link>
          </div>
        )}

        {/* Invoice list */}
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-2xl shadow p-4 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {inv.rental_type === "hotel"
                      ? "🏨"
                      : inv.rental_type === "cottage"
                      ? "🛖"
                      : inv.rental_type === "camping"
                      ? "⛺"
                      : "🏡"}
                  </span>
                  <p className="font-semibold text-gray-900">{inv.client_name}</p>
                  <StatusBadge status={inv.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {inv.invoice_number} •{" "}
                  {format(new Date(inv.invoice_date), "dd MMM yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-900 text-sm">
                  ₹ {formatCurrency(inv.total)}
                </p>
                <Link
                  href={`/invoice/${inv.id}`}
                  className="text-gray-400 hover:text-[#2D3A8C] transition"
                >
                  <Eye size={18} />
                </Link>
                <button
                  onClick={() => handleDelete(inv.id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    paid: "bg-green-50 text-green-600",
    partial: "bg-amber-50 text-amber-600",
    unpaid: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
        styles[status as keyof typeof styles] || styles.unpaid
      }`}
    >
      {status}
    </span>
  );
}