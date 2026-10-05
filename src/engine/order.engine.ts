import { OrderStatus } from '../types/order.types';

export function canSellerShip(status: OrderStatus): boolean {
  return status === 'Paid (Unconfirmed)' || status === 'Paid (Receipt Uploaded)' || status === 'Paid (Confirmed)';
}

export function canBuyerConfirmDelivery(status: OrderStatus): boolean {
  return status === 'Shipped';
}

export function canOpenDispute(status: OrderStatus): boolean {
  return status !== 'Done' && status !== 'Disputed';
}

export function canCancelOrder(status: OrderStatus): boolean {
  return status === 'Paid (Unconfirmed)' || status === 'Paid (Receipt Uploaded)';
}
