import { computeInvoice } from "./invoice-utils";
import type { InvoiceSchema } from "./invoice-schema";

export async function autoSaveInvoice(data: InvoiceSchema): Promise<{
  success: boolean;
  limitReached?: boolean;
}> {
  try {
    const computed = computeInvoice(data);
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(computed),
    });

    if (res.status === 403) {
      const data = await res.json();
      if (data.error === "free_limit_reached") {
        return { success: false, limitReached: true };
      }
    }

    return { success: res.ok };
  } catch (err) {
    console.error("Auto-save failed:", err);
    return { success: false };
  }
}