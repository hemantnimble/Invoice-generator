"use client";
import Image from "next/image";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import Link from "next/link";
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center space-y-6">
        <div>
          <Image
            src="/icons/icon-192x192.png"
            alt="RentalInvoice"
            width={56}
            height={56}
            className="rounded-xl mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-900">Sign in to RentalInvoice</h1>
          <p className="text-sm text-gray-500 mt-2">
            Save invoices, upload your logo & signature
          </p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <LogIn size={18} />
          Continue with Google
        </button>

        <p className="text-xs text-gray-400">
          Free invoices without login are still available{" "}
          <Link href="/" className="text-indigo-600 underline">
            here
          </Link>
        </p>
      </div>
    </main>
  );
}