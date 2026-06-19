import { numberToWords } from "./number-to-words";
import type { InvoiceFormData, InvoiceComputedData } from "@/types/invoice";

export function computeInvoice(data: InvoiceFormData): InvoiceComputedData {
  const subTotal = data.items.reduce(
    (sum, item) => sum + item.quantity * item.pricePerUnit,
    0
  );
  const total = subTotal;
  const balance = total - (data.amountReceived || 0);

  return {
    ...data,
    subTotal,
    total,
    balance,
    amountInWords: numberToWords(total),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 900 + 100);
  return `INV-${year}${month}-${random}`;
}