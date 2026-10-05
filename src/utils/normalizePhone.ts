/**
 * Normalizes all Nigerian phone number formats to +234XXXXXXXXXX
 * Example inputs: 08031234567, 8031234567, +2348031234567, 2348031234567, 080 312 34567
 */
export function normalizePhone(raw: string): string {
  if (!raw) return '';
  // Strip all non-digit characters
  const digits = raw.replace(/\D/g, '');

  if (digits.startsWith('234') && digits.length === 13) {
    return `+${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+234${digits}`;
  }
  // Fallback if already full international or edge length
  if (digits.length >= 11) {
    return `+${digits}`;
  }
  return raw.trim();
}
