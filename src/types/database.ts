export type Profile = {
  id: string;
  user_id: string;
  business_name: string;
  business_phone: string;
  business_address: string;
  logo_url: string | null;
  signature_url: string | null;
  created_at: string;
};

export type InvoiceRecord = {
  id: string;
  user_id: string;
  invoice_number: string;
  client_name: string;
  client_contact: string;
  invoice_date: string;
  items: LineItemRecord[];
  sub_total: number;
  total: number;
  amount_received: number;
  balance: number;
  status: "paid" | "unpaid" | "partial";
  created_at: string;
};

export type LineItemRecord = {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
};