"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, type InvoiceSchema } from "@/lib/invoice-schema";
import { generateInvoiceNumber } from "@/lib/invoice-utils";
import { getRentalType, RENTAL_TYPES } from "@/lib/rental-types";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ColorThemeSelector from "./ColorThemeSelector";
import RentalTypeSelector from "./RentalTypeSelector";
import type { ColorThemeId } from "@/lib/color-themes";
import type { RentalType } from "@/lib/rental-types";

type Props = {
  onChange: (data: InvoiceSchema) => void;
  defaultValues?: InvoiceSchema;
  hideBusinessFields?: boolean;
};

export const baseDefaults: InvoiceSchema = {
  rentalType: "villa",
  clientName: "",
  clientContact: "",
  invoiceNumber: generateInvoiceNumber(),
  invoiceDate: format(new Date(), "yyyy-MM-dd"),
  propertyName: "",
  checkInDate: "",
  checkInTime: "13:00",
  checkOutDate: "",
  checkOutTime: "11:00",
  guestCount: "",
  foodIncluded: false,
  securityDeposit: 0,
  roomNumber: "",
  roomType: "",
  tentType: "",
  items: [{ id: crypto.randomUUID(), name: "", quantity: 1, pricePerUnit: 0 }],
  amountReceived: 0,
  policies: RENTAL_TYPES[0].defaultPolicies,
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

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const rentalType = watch("rentalType");
  const rentalConfig = getRentalType(rentalType || "villa");

  // When rental type changes — update policies and default item name
  useEffect(() => {
    const config = getRentalType(rentalType);
    setValue("policies", config.defaultPolicies);
    setValue("items.0.name", config.defaultItem);
  }, [rentalType, setValue]);

  useEffect(() => {
    const sub = watch((value) => {
      onChange(value as InvoiceSchema);
    });
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-6">
      <h2 className="text-lg font-bold text-gray-800">Invoice Details</h2>

      {/* Rental Type */}
      <Section title="Rental Type">
        <RentalTypeSelector
          value={(watch("rentalType") as RentalType) || "villa"}
          onChange={(type) => setValue("rentalType", type, { shouldDirty: true })}
        />
      </Section>

      {/* Color Theme */}
      <Section title="Invoice Color">
        <ColorThemeSelector
          value={(watch("colorTheme") as ColorThemeId) || "navy"}
          onChange={(theme) => setValue("colorTheme", theme, { shouldDirty: true })}
        />
      </Section>

      {/* Business Info — only for free/non-logged flow */}
      {!hideBusinessFields && (
        <Section title="Your Business">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business Name" error={errors.businessName?.message}>
              <input
                {...register("businessName")}
                placeholder="Your business name"
                className={inputClass}
              />
            </Field>
            <Field label="Phone" error={errors.businessPhone?.message}>
              <input
                {...register("businessPhone")}
                placeholder="Your phone number"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>
      )}

      {/* Bill To */}
      <Section title="Bill To">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Client Name *" error={errors.clientName?.message}>
            <input
              {...register("clientName")}
              placeholder="Client name"
              className={inputClass}
            />
          </Field>
          <Field label="Contact *" error={errors.clientContact?.message}>
            <input
              {...register("clientContact")}
              placeholder="Phone / UPI / ID"
              className={inputClass}
            />
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

      {/* Booking Details */}
      <Section title={`${rentalConfig.emoji} ${rentalConfig.label} Details`}>
        <div className="space-y-4">
          <Field label={rentalConfig.propertyLabel}>
            <input
              {...register("propertyName")}
              placeholder={`e.g. ${rentalConfig.label} name`}
              className={inputClass}
            />
          </Field>

          {/* Hotel specific */}
          {rentalType === "hotel" && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Room Number">
                <input
                  {...register("roomNumber")}
                  placeholder="e.g. 101"
                  className={inputClass}
                />
              </Field>
              <Field label="Room Type">
                <input
                  {...register("roomType")}
                  placeholder="e.g. Deluxe, Suite"
                  className={inputClass}
                />
              </Field>
            </div>
          )}

          {/* Camping specific */}
          {rentalType === "camping" && (
            <Field label="Tent / Cabin Type">
              <input
                {...register("tentType")}
                placeholder="e.g. Swiss Tent, Wooden Cabin"
                className={inputClass}
              />
            </Field>
          )}

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
                placeholder="e.g. 4 Adults, 2 Kids"
                className={inputClass}
              />
            </Field>
            <label className="flex items-center gap-2 pb-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                {...register("foodIncluded")}
                className="w-4 h-4 rounded border-gray-300 focus:ring-[#2D3A8C]"
              />
              {rentalType === "hotel" ? "Meal Plan Included" : "Food Package Included"}
            </label>
          </div>
        </div>
      </Section>

      {/* Charges */}
      <Section title="Charges">
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-1">
            <span className="col-span-5">Item</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-3 text-right">Price/Unit</span>
            <span className="col-span-2"></span>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-5">
                <input
                  {...register(`items.${index}.name`)}
                  placeholder="Charge name"
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
            className="flex items-center gap-1 text-sm text-[#2D3A8C] hover:opacity-70 font-medium mt-1"
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
      <Section title="Policies (optional — shown on invoice if filled)">
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
      <h3 className="text-sm font-semibold text-[#2D3A8C] uppercase tracking-wide border-b border-[#eef0fb] pb-1">
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
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2D3A8C]/30 focus:border-[#2D3A8C] transition placeholder:text-gray-300";