export type LineItem = {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
};

export type RentalType = "villa" | "hotel" | "cottage" | "camping";

export type InvoiceFormData = {
  rentalType: RentalType;
  clientName: string;
  clientContact: string;
  invoiceNumber: string;
  invoiceDate: string;

  // Shared booking
  propertyName?: string;
  checkInDate?: string;
  checkInTime?: string;
  checkOutDate?: string;
  checkOutTime?: string;
  guestCount?: string;
  foodIncluded?: boolean;
  securityDeposit?: number;

  // Hotel specific
  roomNumber?: string;
  roomType?: string;

  // Camping specific
  tentType?: string;

  items: LineItem[];
  amountReceived: number;
  policies?: string;
  businessName?: string;
  businessPhone?: string;
  colorTheme?: "navy" | "green" | "orange" | "black";
};

export type InvoiceComputedData = InvoiceFormData & {
  subTotal: number;
  total: number;
  balance: number;
  amountInWords: string;
};