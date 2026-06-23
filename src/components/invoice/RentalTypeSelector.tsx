"use client";

import { RENTAL_TYPES, type RentalType } from "@/lib/rental-types";
import { cn } from "@/lib/utils";

type Props = {
  value: RentalType;
  onChange: (type: RentalType) => void;
};

export default function RentalTypeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {RENTAL_TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => onChange(type.id)}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl border-2 transition text-center",
            value === type.id
              ? "border-[#2D3A8C] bg-[#eef0fb]"
              : "border-gray-200 bg-white hover:border-gray-300"
          )}
        >
          <span className="text-xl">{type.emoji}</span>
          <span
            className={cn(
              "text-xs font-semibold",
              value === type.id ? "text-[#2D3A8C]" : "text-gray-500"
            )}
          >
            {type.label}
          </span>
        </button>
      ))}
    </div>
  );
}