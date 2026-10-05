export type DisputeResolution =
  | 'Resolved — Seller Banned'
  | 'Resolved — No Action (Buyer Wrong)'
  | 'Resolved — Warning Issued'
  | 'Closed';

export function isDisputeWindowActive(cancelledAt?: string, allowedDays: number = 7): boolean {
  if (!cancelledAt) return true;
  const cancelMs = new Date(cancelledAt).getTime();
  const limitMs = cancelMs + allowedDays * 24 * 3600 * 1000;
  return Date.now() <= limitMs;
}
