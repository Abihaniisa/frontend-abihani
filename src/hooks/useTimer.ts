import { useOrderTimer } from './useOrderTimer';

export function useTimer(shippedAt?: string, countdownHours: number = 72) {
  return useOrderTimer(shippedAt, countdownHours);
}
