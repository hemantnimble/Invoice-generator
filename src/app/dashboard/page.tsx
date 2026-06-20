"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { InvoiceRecord } from "@/types/database";
import { formatCurrency } from "@/lib/invoice-utils";
import { format } from "date-fns";
import { Loader2, Plus, Trash2, Settings, Eye } from "lucide-react";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/invoices")
        .then((res) => res.json())
        .then((data) => {
          setInvoices(data);
          setLoading(false);
        });
    }
  }, [status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this invoice?")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 pb-20 lg:pb-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Your Invoices</h1>
            <p className="text-sm text-gray-500 mt-1">
              {invoices.length} saved invoice{invoices.length !== 1 ? "s" : ""}
            </p>
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
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-xl transition text-sm"
            >
              <Plus size={16} /> New Invoice
            </Link>
          </div>
        </div>

        {/* Empty state */}
        {invoices.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-gray-400 mb-4">No saved invoices yet</p>
            <Link
              href="/invoice/new"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm"
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
                  <p className="font-semibold text-gray-900">{inv.client_name}</p>
                  <StatusBadge status={inv.status} />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {inv.invoice_number} • {format(new Date(inv.invoice_date), "dd MMM yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-gray-900 text-sm">
                  ₹ {formatCurrency(inv.total)}
                </p>
                <Link
                  href={`/invoice/${inv.id}`}
                  className="text-gray-400 hover:text-indigo-600 transition"
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
      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${styles[status as keyof typeof styles] || styles.unpaid
        }`}
    >
      {status}
    </span>
  );
}