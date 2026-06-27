"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import { FileText, PlusCircle, LogIn, LayoutDashboard, MessageCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";


export default function LandingPage() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <AppHeader />
        <AuthButton />
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {session ? `Welcome back, ${session.user?.name?.split(" ")[0]}` : "Rental Invoices Made Simple"}
        </h2>
        <p className="text-sm text-gray-500 mb-8 max-w-sm">
          {session
            ? "Create a saved invoice with your business profile, or use the quick free generator."
            : "Generate professional invoices for villas, hotels, cottages and camping — free, no login required."}
        </p>

        <div className="w-full max-w-sm space-y-3">
          {session ? (
            <>
              <Link
                href="/invoice/new"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-md"
              >
                <PlusCircle size={18} />
                New Invoice (saved to account)
              </Link>
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-6 rounded-xl transition"
              >
                <LayoutDashboard size={18} />
                Go to Dashboard
              </Link>
              <Link
                href="/invoice/free"
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-medium py-2.5 px-6 rounded-xl transition text-sm"
              >
                <FileText size={16} />
                Quick free invoice (not saved)
              </Link>

              <Link
                href="/wa"
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-600 font-medium py-2.5 px-6 rounded-xl transition text-sm"
              >
                <MessageCircle size={16} />
                Quick WhatsApp enquiry
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/invoice/free"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition shadow-md"
              >
                <FileText size={18} />
                Create Free Invoice (not saved)
              </Link>
              <button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-6 rounded-xl transition"
              >
                <LogIn size={18} />
                Sign In to Save Invoices
              </button>
            </>
          )}
        </div>
      </div>

      <PWAInstallBanner />
    </main>
  );
}

function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-8 bg-gray-100 rounded-full animate-pulse" />;
  }

  if (session) {
    return (
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 transition"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition font-medium"
    >
      Sign In
    </button>
  );
}