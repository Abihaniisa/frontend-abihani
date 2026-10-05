/**
 * Formats a numeric price into Nigerian Naira format:
 * Currency: Nigerian Naira (₦). Format ₦38,500. Commas. No decimals.
 */
export function formatPrice(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0';
  }
  const integerVal = Math.round(amount);
  return `₦${integerVal.toLocaleString('en-NG')}`;
}
