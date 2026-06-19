export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
};

export type InvoiceFormData = {
  // Bill To
  clientName: string;
  clientContact: string;

  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;

  // Items
  items: LineItem[];

  // Payment
  amountReceived: number;

  // Optional (logged in users later)
  businessName?: string;
  businessPhone?: string;
};

export type InvoiceComputedData = InvoiceFormData & {
  subTotal: number;
  total: number;
  balance: number;
  amountInWords: string;
};