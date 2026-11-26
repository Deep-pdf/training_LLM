/**
 * Format a numeric value in Indian Rupee (INR) notation.
 */
export function formatINR(amount: number, decimals = 2): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Format large INR amounts into concise Lakhs / Crores architectural notation.
 */
export function formatINRCompact(amount: number): string {
  if (amount >= 10_000_000) {
    return `₹ ${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `₹ ${(amount / 100_000).toFixed(2)} Lakhs`;
  }
  return formatINR(amount, 0);
}
