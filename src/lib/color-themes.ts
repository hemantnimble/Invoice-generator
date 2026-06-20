export type ColorThemeId = "indigo" | "green" | "orange" | "black";

export type ColorTheme = {
  id: ColorThemeId;
  name: string;
  headerBg: string;
  accentText: string;
  accentBg: string;
  swatch: string;
  hex: {
    header: string;
    accent: string;
    accentLight: string;
  };
};

export const COLOR_THEMES: Record<ColorThemeId, ColorTheme> = {
  indigo: {
    id: "indigo",
    name: "Indigo",
    headerBg: "bg-indigo-400",
    accentText: "text-indigo-700",
    accentBg: "bg-indigo-50",
    swatch: "bg-indigo-500",
    hex: { header: "#818cf8", accent: "#4338ca", accentLight: "#eef2ff" },
  },
  green: {
    id: "green",
    name: "Green",
    headerBg: "bg-emerald-500",
    accentText: "text-emerald-700",
    accentBg: "bg-emerald-50",
    swatch: "bg-emerald-500",
    hex: { header: "#10b981", accent: "#047857", accentLight: "#ecfdf5" },
  },
  orange: {
    id: "orange",
    name: "Orange",
    headerBg: "bg-orange-500",
    accentText: "text-orange-700",
    accentBg: "bg-orange-50",
    swatch: "bg-orange-500",
    hex: { header: "#f97316", accent: "#c2410c", accentLight: "#fff7ed" },
  },
  black: {
    id: "black",
    name: "Classic Black",
    headerBg: "bg-gray-800",
    accentText: "text-gray-800",
    accentBg: "bg-gray-50",
    swatch: "bg-gray-800",
    hex: { header: "#1f2937", accent: "#111827", accentLight: "#f9fafb" },
  },
};

export const DEFAULT_THEME: ColorThemeId = "indigo";