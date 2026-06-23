"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { computeInvoice, formatCurrency } from "@/lib/invoice-utils";
import type { InvoiceSchema } from "@/lib/invoice-schema";
import { COLOR_THEMES, DEFAULT_THEME, type ColorThemeId } from "@/lib/color-themes";
import { getRentalType } from "@/lib/rental-types";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
  },
  businessName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#111827" },
  businessSub: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    overflow: "hidden",
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 1,
  },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  billLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151", marginBottom: 3 },
  billName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
  billSub: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  billValue: { fontSize: 9, color: "#111827", marginTop: 1 },
  bookingBox: {
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  bookingTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  bookingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  bookingCell: {
    width: "50%",
    marginBottom: 4,
  },
  bookingLabel: { fontSize: 8, color: "#6b7280" },
  bookingValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  tableHeader: {
    flexDirection: "row",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableHeaderText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  tableFooter: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
  },
  colNum: { width: "6%" },
  colName: { width: "40%" },
  colQty: { width: "12%", textAlign: "center" },
  colPrice: { width: "21%", textAlign: "right" },
  colAmt: { width: "21%", textAlign: "right" },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, gap: 12 },
  wordsBox: { flex: 1, backgroundColor: "#f9fafb", borderRadius: 6, padding: 8 },
  wordsLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  wordsText: { fontSize: 9, color: "#374151", lineHeight: 1.4 },
  summaryBox: { width: 160 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  summaryLabel: { fontSize: 9, color: "#6b7280" },
  summaryValue: { fontSize: 9, color: "#111827" },
  summaryTotalLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
  summaryTotalValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
  summaryBalanceLabel: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  summaryBalanceValue: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  divider: { borderTopWidth: 1, borderTopColor: "#e5e7eb", marginVertical: 4 },
  depositBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fffbeb",
    borderRadius: 4,
    padding: 6,
    marginTop: 4,
  },
  depositLabel: { fontSize: 8, color: "#92400e" },
  depositValue: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#92400e" },
  policiesSection: { marginTop: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb" },
  policiesTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#374151", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  policiesText: { fontSize: 8, color: "#6b7280", lineHeight: 1.5 },
  signatureSection: { marginTop: 40, alignItems: "flex-end" },
  signatureFor: { fontSize: 9, color: "#6b7280" },
  signatureLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
});

type Props = {
  data: InvoiceSchema;
  logoUrl?: string | null;
  signatureUrl?: string | null;
};

export default function InvoicePDF({ data, logoUrl, signatureUrl }: Props) {
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
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            {invoice.businessName && (
              <Text style={styles.businessName}>{invoice.businessName}</Text>
            )}
            {invoice.businessPhone && (
              <Text style={styles.businessSub}>Phone: {invoice.businessPhone}</Text>
            )}
          </View>
          {logoUrl && (
            <View style={styles.logoBox}>
              <Image src={logoUrl} style={{ width: "100%", height: "100%" }} />
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.hex.accent }]}>
          {rental.invoiceTitle}
        </Text>

        {/* Bill To + Invoice Details */}
        <View style={styles.billRow}>
          <View>
            <Text style={styles.billLabel}>Bill To</Text>
            <Text style={styles.billName}>{invoice.clientName || "—"}</Text>
            <Text style={styles.billSub}>Contact No.:</Text>
            <Text style={styles.billValue}>{invoice.clientContact || "—"}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.billLabel}>Invoice Details</Text>
            <Text style={styles.billValue}>Invoice No.: {invoice.invoiceNumber}</Text>
            <Text style={styles.billValue}>Date: {formatDate(invoice.invoiceDate)}</Text>
          </View>
        </View>

        {/* Booking Details */}
        {hasBookingDetails && (
          <View style={[styles.bookingBox, { backgroundColor: theme.hex.accentLight }]}>
            {invoice.propertyName && (
              <Text style={[styles.bookingTitle, { color: theme.hex.accent }]}>
                {invoice.propertyName}
              </Text>
            )}
            <View style={styles.bookingGrid}>
              {invoice.rentalType === "hotel" && (
                <>
                  {invoice.roomNumber && (
                    <View style={styles.bookingCell}>
                      <Text style={styles.bookingLabel}>Room No.</Text>
                      <Text style={styles.bookingValue}>{invoice.roomNumber}</Text>
                    </View>
                  )}
                  {invoice.roomType && (
                    <View style={styles.bookingCell}>
                      <Text style={styles.bookingLabel}>Room Type</Text>
                      <Text style={styles.bookingValue}>{invoice.roomType}</Text>
                    </View>
                  )}
                </>
              )}
              {invoice.rentalType === "camping" && invoice.tentType && (
                <View style={styles.bookingCell}>
                  <Text style={styles.bookingLabel}>Tent/Cabin</Text>
                  <Text style={styles.bookingValue}>{invoice.tentType}</Text>
                </View>
              )}
              {invoice.checkInDate && (
                <View style={styles.bookingCell}>
                  <Text style={styles.bookingLabel}>Check-in</Text>
                  <Text style={styles.bookingValue}>
                    {formatDate(invoice.checkInDate)}{invoice.checkInTime ? `, ${formatTime(invoice.checkInTime)}` : ""}
                  </Text>
                </View>
              )}
              {invoice.checkOutDate && (
                <View style={styles.bookingCell}>
                  <Text style={styles.bookingLabel}>Check-out</Text>
                  <Text style={styles.bookingValue}>
                    {formatDate(invoice.checkOutDate)}{invoice.checkOutTime ? `, ${formatTime(invoice.checkOutTime)}` : ""}
                  </Text>
                </View>
              )}
              {invoice.guestCount && (
                <View style={styles.bookingCell}>
                  <Text style={styles.bookingLabel}>Guests</Text>
                  <Text style={styles.bookingValue}>{invoice.guestCount}</Text>
                </View>
              )}
              <View style={styles.bookingCell}>
                <Text style={styles.bookingLabel}>
                  {invoice.rentalType === "hotel" ? "Meal Plan" : "Food Package"}
                </Text>
                <Text style={styles.bookingValue}>
                  {invoice.foodIncluded ? "Included" : "Not Included"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Table Header */}
        <View style={[styles.tableHeader, { backgroundColor: theme.hex.header }]}>
          <Text style={[styles.tableHeaderText, styles.colNum]}>#</Text>
          <Text style={[styles.tableHeaderText, styles.colName]}>Charge</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
          <Text style={[styles.tableHeaderText, styles.colPrice]}>Price/Unit</Text>
          <Text style={[styles.tableHeaderText, styles.colAmt]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {invoice.items.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[{ fontSize: 9, color: "#6b7280" }, styles.colNum]}>{index + 1}</Text>
            <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colName]}>{item.name || "—"}</Text>
            <Text style={[{ fontSize: 9 }, styles.colQty]}>{item.quantity}</Text>
            <Text style={[{ fontSize: 9 }, styles.colPrice]}>Rs. {formatCurrency(item.pricePerUnit)}</Text>
            <Text style={[{ fontSize: 9 }, styles.colAmt]}>Rs. {formatCurrency(item.quantity * item.pricePerUnit)}</Text>
          </View>
        ))}

        {/* Table Footer */}
        <View style={styles.tableFooter}>
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colNum]} />
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colName]}>Total</Text>
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colQty]}>
            {invoice.items.reduce((s, i) => s + Number(i.quantity), 0)}
          </Text>
          <Text style={styles.colPrice} />
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colAmt]}>
            Rs. {formatCurrency(invoice.total)}
          </Text>
        </View>

        {/* Bottom: Words + Summary */}
        <View style={styles.bottomRow}>
          <View style={styles.wordsBox}>
            <Text style={styles.wordsLabel}>Invoice Amount In Words:</Text>
            <Text style={styles.wordsText}>{invoice.amountInWords}</Text>
          </View>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total</Text>
              <Text style={styles.summaryValue}>Rs. {formatCurrency(invoice.subTotal)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>Rs. {formatCurrency(invoice.total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Received</Text>
              <Text style={styles.summaryValue}>Rs. {formatCurrency(invoice.amountReceived || 0)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryBalanceLabel, { color: theme.hex.accent }]}>Balance</Text>
              <Text style={[styles.summaryBalanceValue, { color: theme.hex.accent }]}>Rs. {formatCurrency(invoice.balance)}</Text>
            </View>
            {!!invoice.securityDeposit && invoice.securityDeposit > 0 && (
              <View style={styles.depositBox}>
                <Text style={styles.depositLabel}>Security Deposit (refundable)</Text>
                <Text style={styles.depositValue}>Rs. {formatCurrency(invoice.securityDeposit)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Policies */}
        {invoice.policies && invoice.policies.trim().length > 0 && (
          <View style={styles.policiesSection}>
            <Text style={styles.policiesTitle}>Policies</Text>
            <Text style={styles.policiesText}>{invoice.policies}</Text>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signatureSection}>
          {invoice.businessName && (
            <Text style={styles.signatureFor}>For: {invoice.businessName}</Text>
          )}
          {signatureUrl && (
            <Image
              src={signatureUrl}
              style={{ width: 120, height: 50, marginTop: 12, marginBottom: 4 }}
            />
          )}
          <Text style={[styles.signatureLabel, { marginTop: signatureUrl ? 0 : 16 }]}>
            Authorized Signatory
          </Text>
        </View>

      </Page>
    </Document>
  );
}