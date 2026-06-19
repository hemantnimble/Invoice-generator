"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { computeInvoice, formatCurrency } from "@/lib/invoice-utils";
import type { InvoiceSchema } from "@/lib/invoice-schema";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  // Header
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
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 8, color: "#9ca3af", fontFamily: "Helvetica-Bold" },
  // Title
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 1,
  },
  // Bill To
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  billLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151", marginBottom: 3 },
  billName: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827" },
  billSub: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  billValue: { fontSize: 9, color: "#111827", marginTop: 1 },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#818cf8",
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
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
  // Col widths
  colNum: { width: "6%" },
  colName: { width: "34%" },
  colHsn: { width: "16%", textAlign: "center" },
  colQty: { width: "12%", textAlign: "center" },
  colPrice: { width: "16%", textAlign: "right" },
  colAmt: { width: "16%", textAlign: "right" },
  // Summary
  bottomRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 16, gap: 12 },
  wordsBox: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 8,
  },
  wordsLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  wordsText: { fontSize: 9, color: "#374151", lineHeight: 1.4 },
  summaryBox: { width: 160 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: { fontSize: 9, color: "#6b7280" },
  summaryValue: { fontSize: 9, color: "#111827" },
  summaryTotalLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
  summaryTotalValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#111827" },
  summaryBalanceLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#4338ca" },
  summaryBalanceValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#4338ca" },
  divider: { borderTopWidth: 1, borderTopColor: "#e5e7eb", marginVertical: 4 },
  // Signature
  signatureSection: { marginTop: 40, alignItems: "flex-end" },
  signatureFor: { fontSize: 9, color: "#6b7280" },
  signatureLine: { borderTopWidth: 1, borderTopColor: "#d1d5db", width: 120, marginTop: 24, marginBottom: 4 },
  signatureLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
});

type Props = { data: InvoiceSchema };

export default function InvoicePDF({ data }: Props) {
  const invoice = computeInvoice(data);

  const formatDate = (dateStr: string) => {
    try { return format(new Date(dateStr), "dd-MM-yyyy"); }
    catch { return dateStr; }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.businessName}>{invoice.businessName || "Villas Rental"}</Text>
            <Text style={styles.businessSub}>Lonavala</Text>
            <Text style={styles.businessSub}>Phone no.: {invoice.businessPhone || "—"}</Text>
          </View>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Tax Invoice</Text>

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

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.colNum]}>#</Text>
          <Text style={[styles.tableHeaderText, styles.colName]}>Item Name</Text>
          <Text style={[styles.tableHeaderText, styles.colHsn]}>HSN/SAC</Text>
          <Text style={[styles.tableHeaderText, styles.colQty]}>Quantity</Text>
          <Text style={[styles.tableHeaderText, styles.colPrice]}>Price/Unit</Text>
          <Text style={[styles.tableHeaderText, styles.colAmt]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {invoice.items.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[{ fontSize: 9, color: "#6b7280" }, styles.colNum]}>{index + 1}</Text>
            <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colName]}>{item.name || "—"}</Text>
            <Text style={[{ fontSize: 9, color: "#9ca3af" }, styles.colHsn]}>—</Text>
            <Text style={[{ fontSize: 9 }, styles.colQty]}>{item.quantity}</Text>
            <Text style={[{ fontSize: 9 }, styles.colPrice]}>₹ {formatCurrency(item.pricePerUnit)}</Text>
            <Text style={[{ fontSize: 9 }, styles.colAmt]}>₹ {formatCurrency(item.quantity * item.pricePerUnit)}</Text>
          </View>
        ))}

        {/* Table Footer */}
        <View style={styles.tableFooter}>
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colNum]} />
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colName]}>Total</Text>
          <Text style={styles.colHsn} />
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colQty]}>
            {invoice.items.reduce((s, i) => s + i.quantity, 0)}
          </Text>
          <Text style={styles.colPrice} />
          <Text style={[{ fontSize: 9, fontFamily: "Helvetica-Bold" }, styles.colAmt]}>
            ₹ {formatCurrency(invoice.total)}
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
              <Text style={styles.summaryValue}>₹ {formatCurrency(invoice.subTotal)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>₹ {formatCurrency(invoice.total)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Received</Text>
              <Text style={styles.summaryValue}>₹ {formatCurrency(invoice.amountReceived || 0)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryBalanceLabel}>Balance</Text>
              <Text style={styles.summaryBalanceValue}>₹ {formatCurrency(invoice.balance)}</Text>
            </View>
          </View>
        </View>

        {/* Signature */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureFor}>For: {invoice.businessName || "Villas Rental"}</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>Authorized Signatory</Text>
        </View>

      </Page>
    </Document>
  );
}