export function formatNaira(amount?: number | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₦0';
  }
  const integerVal = Math.round(amount);
  return `₦${integerVal.toLocaleString('en-NG')}`;
}
