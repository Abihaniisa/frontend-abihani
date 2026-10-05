import { useOrderStore } from '../store/order.store';

export function useOrder() {
  const store = useOrderStore();
  return store;
}
