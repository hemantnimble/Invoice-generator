import { z } from "zod";

export const lineItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  pricePerUnit: z.coerce.number().min(0, "Price must be positive"),
});

export const invoiceSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientContact: z.string().min(1, "Contact is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Date is required"),

  villaName: z.string().optional(),
  checkInDate: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutDate: z.string().optional(),
  checkOutTime: z.string().optional(),
  guestCount: z.string().optional(),
  foodIncluded: z.boolean().optional(),

  items: z.array(lineItemSchema).min(1, "Add at least one item"),
  amountReceived: z.coerce.number().min(0, "Amount must be positive"),
  securityDeposit: z.coerce.number().min(0).optional(),

  policies: z.string().optional(),

  businessName: z.string().optional(),
  businessPhone: z.string().optional(),
  colorTheme: z.enum(["indigo", "green", "orange", "black"]),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;