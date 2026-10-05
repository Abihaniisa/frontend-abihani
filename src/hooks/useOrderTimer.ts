import { useMemo } from 'react';

export interface OrderTimerInfo {
  formattedRemaining: string;
  hoursRemaining: number;
  colorClass: string;
  isExpired: boolean;
}

export function useOrderTimer(shippedAt?: string, countdownHours: number = 72): OrderTimerInfo {
  return useMemo(() => {
    if (!shippedAt) {
      return {
        formattedRemaining: '72h remaining',
        hoursRemaining: 72,
        colorClass: 'text-[#C41E3A]',
        isExpired: false,
      };
    }

    const shippedTime = new Date(shippedAt).getTime();
    const expiryTime = shippedTime + countdownHours * 3600 * 1000;
    const now = Date.now();
    const diffMs = expiryTime - now;

    if (diffMs <= 0) {
      return {
        formattedRemaining: 'Window expired',
        hoursRemaining: 0,
        colorClass: 'text-[#FF3B3B]',
        isExpired: true,
      };
    }

    const totalHours = Math.floor(diffMs / (3600 * 1000));
    const totalMinutes = Math.floor((diffMs % (3600 * 1000)) / (60 * 1000));

    let colorClass = 'text-[#C41E3A]'; // Crimson normally
    if (totalHours < 24) {
      colorClass = 'text-[#FF3B3B]'; // Crimson-danger under 24h
    } else if (totalHours < 48) {
      colorClass = 'text-[#E7C27A]'; // Gold under 48h
    }

    return {
      formattedRemaining: `${totalHours}h ${totalMinutes}m to confirm`,
      hoursRemaining: totalHours,
      colorClass,
      isExpired: false,
    };
  }, [shippedAt, countdownHours]);
}
