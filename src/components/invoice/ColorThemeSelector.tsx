"use client";

import { COLOR_THEMES, type ColorThemeId } from "@/lib/color-themes";
import { Check } from "lucide-react";

type Props = {
  value: ColorThemeId;
  onChange: (theme: ColorThemeId) => void;
};

export default function ColorThemeSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      {Object.values(COLOR_THEMES).map((theme) => (
        <button
          key={theme.id}
          type="button"
          onClick={() => onChange(theme.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div
            className={`w-8 h-8 rounded-full ${theme.swatch} flex items-center justify-center ring-2 ring-offset-2 transition ${
              value === theme.id ? "ring-gray-400" : "ring-transparent"
            }`}
          >
            {value === theme.id && <Check size={14} className="text-white" />}
          </div>
          <span className="text-[10px] text-gray-500 group-hover:text-gray-700">
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}