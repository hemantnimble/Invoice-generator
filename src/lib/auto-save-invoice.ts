import { computeInvoice } from "./invoice-utils";
import type { InvoiceSchema } from "./invoice-schema";

export async function autoSaveInvoice(data: InvoiceSchema): Promise<boolean> {
  try {
    const computed = computeInvoice(data);
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(computed),
    });
    return res.ok;
  } catch (err) {
    console.error("Auto-save failed:", err);
    return false;
  }
}