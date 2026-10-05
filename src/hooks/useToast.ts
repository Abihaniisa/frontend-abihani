import { useUIStore } from '../store/ui.store';

export function useToast() {
  const { toasts, addToast, removeToast } = useUIStore();
  return { toasts, addToast, removeToast };
}
