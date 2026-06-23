"use client";

import Image from "next/image";

export default function AppHeader() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/icons/icon-192x192.png"
        alt="RentalInvoice"
        width={32}
        height={32}
        className="rounded-lg"
      />
      <h1 className="text-lg font-bold text-gray-900">RentalInvoice</h1>
    </div>
  );
}