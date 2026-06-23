"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, type InvoiceSchema } from "@/lib/invoice-schema";
import { generateInvoiceNumber } from "@/lib/invoice-utils";
import { DEFAULT_POLICIES } from "@/lib/default-policies";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ColorThemeSelector from "./ColorThemeSelector";
import type { ColorThemeId } from "@/lib/color-themes";

type Props = {
  onChange: (data: InvoiceSchema) => void;
  defaultValues?: InvoiceSchema;
  hideBusinessFields?: boolean;
};
export const baseDefaults: InvoiceSchema = {
  clientName: "",
  clientContact: "",
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: format(new Date(), "yyyy-MM-dd"),
  villaName: "",
  checkInDate: "",
  checkInTime: "13:00",
  checkOutDate: "",
  checkOutTime: "11:00",
  guestCount: "",
  foodIncluded: false,
  items: [{ id: crypto.randomUUID(), name: "Villa Stay", quantity: 1, pricePerUnit: 0 }],
  amountReceived: 0,
  securityDeposit: 0,
  policies: DEFAULT_POLICIES,
  businessName: "",
  businessPhone: "",
  colorTheme: "navy",
};

export default function InvoiceForm({ onChange, defaultValues, hideBusinessFields }: Props) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceSchema>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: defaultValues ?? baseDefaults,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    const sub = watch((value) => {
      onChange(value as InvoiceSchema);
    });
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <h2 className="text-lg font-bold text-gray-800">Invoice Details</h2>

      {/* Color Theme */}
      <Section title="Invoice Color">
        <ColorThemeSelector
          value={(watch("colorTheme") as ColorThemeId) || "indigo"}
          onChange={(theme) => setValue("colorTheme", theme, { shouldDirty: true })}
        />
      </Section>

      {/* Business Info */}
      {!hideBusinessFields && (
        <Section title="Your Business">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business Name" error={errors.businessName?.message}>
              <input {...register("businessName")} placeholder="Your business name" className={inputClass} />
            </Field>
            <Field label="Phone" error={errors.businessPhone?.message}>
              <input {...register("businessPhone")} placeholder="Your phone number" className={inputClass} />
            </Field>
          </div>
        </Section>
      )}

      {/* Bill To */}
      <Section title="Bill To">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Client Name *" error={errors.clientName?.message}>
            <input {...register("clientName")} placeholder="Client name" className={inputClass} />
          </Field>
          <Field label="Contact *" error={errors.clientContact?.message}>
            <input {...register("clientContact")} placeholder="Phone / UPI / ID" className={inputClass} />
          </Field>
        </div>
      </Section>

      {/* Invoice Meta */}
      <Section title="Invoice Info">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Invoice No *" error={errors.invoiceNumber?.message}>
            <input {...register("invoiceNumber")} className={inputClass} />
          </Field>
          <Field label="Date *" error={errors.invoiceDate?.message}>
            <input type="date" {...register("invoiceDate")} className={inputClass} />
          </Field>
        </div>
      </Section>

      {/* Villa Booking Details */}
      <Section title="Booking Details">
        <div className="space-y-4">
          <Field label="Villa Name">
            <input
              {...register("villaName")}
              placeholder="e.g. CAPSTONE VILLA (3 BHK)"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Check-in Date">
              <input type="date" {...register("checkInDate")} className={inputClass} />
            </Field>
            <Field label="Check-in Time">
              <input type="time" {...register("checkInTime")} className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Check-out Date">
              <input type="date" {...register("checkOutDate")} className={inputClass} />
            </Field>
            <Field label="Check-out Time">
              <input type="time" {...register("checkOutTime")} className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <Field label="Guests">
              <input
                {...register("guestCount")}
                placeholder="e.g. 9 Adults"
                className={inputClass}
              />
            </Field>
            <label className="flex items-center gap-2 pb-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("foodIncluded")}
                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
              />
              Food Package Included
            </label>
          </div>
        </div>
      </Section>

      {/* Line Items */}
      <Section title="Charges">
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-1">
            <span className="col-span-5">Item Name</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-3 text-right">Price/Unit</span>
            <span className="col-span-2"></span>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-5">
                <input
                  {...register(`items.${index}.name`)}
                  placeholder="e.g. Villa stay"
                  className={cn(inputClass, errors.items?.[index]?.name && "border-red-400")}
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                  min={1}
                  className={cn(inputClass, "text-center")}
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  {...register(`items.${index}.pricePerUnit`, { valueAsNumber: true })}
                  min={0}
                  placeholder="0"
                  className={cn(inputClass, "text-right")}
                />
              </div>
              <div className="col-span-2 flex justify-center pt-2">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              append({ id: crypto.randomUUID(), name: "", quantity: 1, pricePerUnit: 0 })
            }
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium mt-1"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </Section>

      {/* Payment */}
      <Section title="Payment">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Amount Received (₹)" error={errors.amountReceived?.message}>
            <input
              type="number"
              {...register("amountReceived", { valueAsNumber: true })}
              min={0}
              placeholder="0"
              className={inputClass}
            />
          </Field>
          <Field label="Security Deposit (₹, refundable)">
            <input
              type="number"
              {...register("securityDeposit", { valueAsNumber: true })}
              min={0}
              placeholder="0"
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      {/* Policies */}
      <Section title="Home Rules / Policies (optional, shown on invoice if filled)">
        <textarea
          {...register("policies")}
          rows={8}
          className={cn(inputClass, "font-mono text-xs leading-relaxed resize-y")}
          placeholder="Leave empty to hide this section on the invoice"
        />
      </Section>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide border-b border-indigo-100 pb-1">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition placeholder:text-gray-300";