export function calculatePlatformFee(amount: number, feePercent: number = 1.0): number {
  return Math.round((amount * feePercent) / 100);
}

export function calculateSellerPayout(amount: number, feePercent: number = 1.0): number {
  return amount - calculatePlatformFee(amount, feePercent);
}
