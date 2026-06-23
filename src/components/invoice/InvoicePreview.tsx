"use client";

import { computeInvoice, formatCurrency } from "@/lib/invoice-utils";
import type { InvoiceSchema } from "@/lib/invoice-schema";
import { COLOR_THEMES, DEFAULT_THEME, type ColorThemeId } from "@/lib/color-themes";
import { getRentalType } from "@/lib/rental-types";
import { format } from "date-fns";

type Props = {
  data: InvoiceSchema;
  logoUrl?: string | null;
  signatureUrl?: string | null;
};

export default function InvoicePreview({ data, logoUrl, signatureUrl }: Props) {
  const invoice = computeInvoice(data);
  const theme = COLOR_THEMES[(invoice.colorTheme as ColorThemeId) || DEFAULT_THEME];
  const rental = getRentalType(invoice.rentalType || "villa");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try { return format(new Date(dateStr), "dd MMM yyyy"); }
    catch { return dateStr; }
  };

  const formatTime = (time?: string) => {
    if (!time) return "";
    try {
      const [h, m] = time.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
    } catch { return time; }
  };

  const hasBookingDetails =
    invoice.propertyName ||
    invoice.checkInDate ||
    invoice.checkOutDate ||
    invoice.guestCount ||
    invoice.roomNumber ||
    invoice.tentType;

  return (
    <div
      id="invoice-preview"
      className="bg-white rounded-2xl shadow p-8 text-gray-800 font-sans min-h-[600px]"
      style={{ fontFamily: "Arial, sans-serif", width: "595px", maxWidth: "595px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          {invoice.businessName && (
            <h1 className="text-2xl font-bold text-gray-900">{invoice.businessName}</h1>
          )}
          {invoice.businessPhone && (
            <p className="text-sm text-gray-500 mt-1">Phone: {invoice.businessPhone}</p>
          )}
        </div>
        {logoUrl && (
          <div className="w-16 h-16 rounded-full border-2 border-gray-200 overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Title */}
      <h2 className={`text-center text-xl font-bold mb-6 tracking-wide ${theme.accentText}`}>
        {rental.invoiceTitle}
      </h2>

      {/* Bill To + Invoice Details */}
      <div className="flex justify-between mb-6">
        <div>
          <p className="text-sm font-bold text-gray-700 mb-1">Bill To</p>
          <p className="font-semibold text-gray-900">{invoice.clientName || "—"}</p>
          <p className="text-sm text-gray-500 mt-1">Contact No.:</p>
          <p className="text-sm text-gray-700 break-all max-w-[200px]">
            {invoice.clientContact || "—"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-700 mb-1">Invoice Details</p>
          <p className="text-sm text-gray-600">
            Invoice No.:{" "}
            <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
          </p>
          <p className="text-sm text-gray-600">
            Date:{" "}
            <span className="font-medium text-gray-900">{formatDate(invoice.invoiceDate)}</span>
          </p>
        </div>
      </div>

      {/* Booking Details Box */}
      {hasBookingDetails && (
        <div className={`mb-6 rounded-xl p-4 ${theme.accentBg}`}>
          {invoice.propertyName && (
            <p className={`font-bold mb-3 text-sm ${theme.accentText}`}>
              {rental.emoji} {invoice.propertyName}
            </p>
          )}
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {/* Hotel specific */}
            {invoice.rentalType === "hotel" && (
              <>
                {invoice.roomNumber && (
                  <div>
                    <span className="text-gray-500">Room No.: </span>
                    <span className="font-medium text-gray-900">{invoice.roomNumber}</span>
                  </div>
                )}
                {invoice.roomType && (
                  <div>
                    <span className="text-gray-500">Room Type: </span>
                    <span className="font-medium text-gray-900">{invoice.roomType}</span>
                  </div>
                )}
              </>
            )}

            {/* Camping specific */}
            {invoice.rentalType === "camping" && invoice.tentType && (
              <div>
                <span className="text-gray-500">Tent/Cabin: </span>
                <span className="font-medium text-gray-900">{invoice.tentType}</span>
              </div>
            )}

            {/* Shared fields */}
            {invoice.checkInDate && (
              <div>
                <span className="text-gray-500">Check-in: </span>
                <span className="font-medium text-gray-900">
                  {formatDate(invoice.checkInDate)}
                  {invoice.checkInTime && `, ${formatTime(invoice.checkInTime)}`}
                </span>
              </div>
            )}
            {invoice.checkOutDate && (
              <div>
                <span className="text-gray-500">Check-out: </span>
                <span className="font-medium text-gray-900">
                  {formatDate(invoice.checkOutDate)}
                  {invoice.checkOutTime && `, ${formatTime(invoice.checkOutTime)}`}
                </span>
              </div>
            )}
            {invoice.guestCount && (
              <div>
                <span className="text-gray-500">Guests: </span>
                <span className="font-medium text-gray-900">{invoice.guestCount}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">
                {invoice.rentalType === "hotel" ? "Meal Plan: " : "Food Package: "}
              </span>
              <span className="font-medium text-gray-900">
                {invoice.foodIncluded ? "Included" : "Not Included"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <table className="w-full mb-6 text-sm">
        <thead>
          <tr className={`${theme.headerBg} text-white`}>
            <th className="py-2 px-3 text-left rounded-tl-md w-8">#</th>
            <th className="py-2 px-3 text-left">Charge</th>
            <th className="py-2 px-3 text-center w-20">Qty</th>
            <th className="py-2 px-3 text-right w-28">Price/Unit</th>
            <th className="py-2 px-3 text-right rounded-tr-md w-28">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-3 px-3 text-gray-500">{index + 1}</td>
              <td className="py-3 px-3 font-medium">{item.name || "—"}</td>
              <td className="py-3 px-3 text-center">{item.quantity}</td>
              <td className="py-3 px-3 text-right">₹ {formatCurrency(item.pricePerUnit)}</td>
              <td className="py-3 px-3 text-right">
                ₹ {formatCurrency(item.quantity * item.pricePerUnit)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-gray-200 font-bold">
            <td className="py-3 px-3" />
            <td className="py-3 px-3">Total</td>
            <td className="py-3 px-3 text-center">
              {invoice.items.reduce((s, i) => s + Number(i.quantity), 0)}
            </td>
            <td />
            <td className="py-3 px-3 text-right">₹ {formatCurrency(invoice.total)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Amount in Words + Summary */}
      <div className="flex justify-between items-start gap-6 mt-4">
        <div className="flex-1 bg-gray-50 rounded-lg p-3 text-sm">
          <span className="font-bold">Invoice Amount In Words: </span>
          <span className="text-gray-700">{invoice.amountInWords}</span>
        </div>
        <div className="w-56 text-sm space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Sub Total</span>
            <span>₹ {formatCurrency(invoice.subTotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
            <span>Total</span>
            <span>₹ {formatCurrency(invoice.total)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Received</span>
            <span>₹ {formatCurrency(invoice.amountReceived || 0)}</span>
          </div>
          <div className={`flex justify-between font-bold border-t border-gray-200 pt-2 ${theme.accentText}`}>
            <span>Balance</span>
            <span>₹ {formatCurrency(invoice.balance)}</span>
          </div>
          {!!invoice.securityDeposit && invoice.securityDeposit > 0 && (
            <div className="flex justify-between text-amber-700 bg-amber-50 rounded-md px-2 py-1.5 mt-2">
              <span className="text-xs font-medium">Security Deposit (refundable)</span>
              <span className="text-xs font-bold">₹ {formatCurrency(invoice.securityDeposit)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Policies */}
      {invoice.policies && invoice.policies.trim().length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Policies
          </p>
          <pre className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">
            {invoice.policies}
          </pre>
        </div>
      )}

      {/* Signature */}
      <div className="mt-10 text-right text-sm text-gray-600">
        {invoice.businessName && <p>For: {invoice.businessName}</p>}
        {signatureUrl && (
          <div className="mt-4 mb-2 ml-auto" style={{ width: 160, height: 60 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={signatureUrl} alt="Signature" className="w-full h-full object-contain ml-auto" />
          </div>
        )}
        <p className="font-semibold text-gray-800 mt-4">Authorized Signatory</p>
      </div>
    </div>
  );
}