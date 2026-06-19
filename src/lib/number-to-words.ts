const ones = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const tens = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty",
  "Sixty", "Seventy", "Eighty", "Ninety",
];

function twoDigits(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ones[n];
  return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
}

function threeDigits(n: number): string {
  if (n === 0) return "";
  const hundred = Math.floor(n / 100);
  const rest = n % 100;
  let result = "";
  if (hundred > 0) {
    result += ones[hundred] + " Hundred";
    if (rest > 0) result += " " + twoDigits(rest);
  } else {
    result += twoDigits(rest);
  }
  return result;
}

export function numberToWords(amount: number): string {
  if (!amount || amount === 0) return "Zero Rupees only";

  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);

  let result = "";
  let remaining = rupees;

  if (remaining >= 10000000) {
    const crore = Math.floor(remaining / 10000000);
    result += threeDigits(crore) + " Crore ";
    remaining = remaining % 10000000;
  }

  if (remaining >= 100000) {
    const lakh = Math.floor(remaining / 100000);
    result += threeDigits(lakh) + " Lakh ";
    remaining = remaining % 100000;
  }

  if (remaining >= 1000) {
    const thousand = Math.floor(remaining / 1000);
    result += threeDigits(thousand) + " Thousand ";
    remaining = remaining % 1000;
  }

  if (remaining > 0) {
    result += threeDigits(remaining) + " ";
  }

  result = result.trim() + " Rupees";

  if (paise > 0) {
    result += " and " + twoDigits(paise) + " Paise";
  }

  return result + " only";
}