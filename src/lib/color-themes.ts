export type ColorThemeId = "navy" | "green" | "orange" | "black";

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
  navy: {
    id: "navy",
    name: "Navy",
    headerBg: "bg-[#2D3A8C]",
    accentText: "text-[#2D3A8C]",
    accentBg: "bg-[#eef0fb]",
    swatch: "bg-[#2D3A8C]",
    hex: { header: "#2D3A8C", accent: "#2D3A8C", accentLight: "#eef0fb" },
  },
  green: {
    id: "green",
    name: "Mint",
    headerBg: "bg-[#4ECBA5]",
    accentText: "text-[#4ECBA5]",
    accentBg: "bg-[#edfbf6]",
    swatch: "bg-[#4ECBA5]",
    hex: { header: "#4ECBA5", accent: "#3aab87", accentLight: "#edfbf6" },
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
    name: "Classic",
    headerBg: "bg-gray-800",
    accentText: "text-gray-800",
    accentBg: "bg-gray-50",
    swatch: "bg-gray-800",
    hex: { header: "#1f2937", accent: "#111827", accentLight: "#f9fafb" },
  },
};

export const DEFAULT_THEME: ColorThemeId = "navy";