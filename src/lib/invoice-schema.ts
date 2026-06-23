import { z } from "zod";

export const lineItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  pricePerUnit: z.coerce.number().min(0, "Price must be positive"),
});

export const invoiceSchema = z.object({
  // Rental type
  rentalType: z.enum(["villa", "hotel", "cottage", "camping"]),

  // Client
  clientName: z.string().min(1, "Client name is required"),
  clientContact: z.string().min(1, "Contact is required"),

  // Invoice meta
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.string().min(1, "Date is required"),

  // Shared booking fields
  propertyName: z.string().optional(),
  checkInDate: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutDate: z.string().optional(),
  checkOutTime: z.string().optional(),
  guestCount: z.string().optional(),
  foodIncluded: z.boolean().optional(),
  securityDeposit: z.coerce.number().min(0).optional(),

  // Hotel specific
  roomNumber: z.string().optional(),
  roomType: z.string().optional(),

  // Camping specific
  tentType: z.string().optional(),

  // Charges
  items: z.array(lineItemSchema).min(1, "Add at least one item"),
  amountReceived: z.coerce.number().min(0, "Amount must be positive"),

  // Policies
  policies: z.string().optional(),

  // Business
  businessName: z.string().optional(),
  businessPhone: z.string().optional(),
  colorTheme: z.enum(["navy", "green", "orange", "black"]),
});

export type InvoiceSchema = z.infer<typeof invoiceSchema>;