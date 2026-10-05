export interface EscrowReleaseWindow {
  countdownHours: number;
  isAutoReleaseEligible: boolean;
}

export function computeEscrowWindow(shippedAt?: string, windowDays: number = 3): EscrowReleaseWindow {
  if (!shippedAt) {
    return { countdownHours: windowDays * 24, isAutoReleaseEligible: false };
  }
  const shippedMs = new Date(shippedAt).getTime();
  const expiryMs = shippedMs + windowDays * 24 * 3600 * 1000;
  const remainingHours = Math.max(0, Math.floor((expiryMs - Date.now()) / (3600 * 1000)));

  return {
    countdownHours: remainingHours,
    isAutoReleaseEligible: remainingHours === 0,
  };
}
