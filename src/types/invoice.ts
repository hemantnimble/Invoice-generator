export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
};

export type InvoiceFormData = {
  clientName: string;
  clientContact: string;

  invoiceNumber: string;
  invoiceDate: string;

  villaName?: string;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  guestCount?: string;
  foodIncluded?: boolean;

  items: LineItem[];

  amountReceived: number;
  securityDeposit?: number;

  policies?: string;

  businessName?: string;
  businessPhone?: string;
  colorTheme?: "indigo" | "green" | "orange" | "black";
};

export type InvoiceComputedData = InvoiceFormData & {
  subTotal: number;
  total: number;
  balance: number;
  amountInWords: string;
};