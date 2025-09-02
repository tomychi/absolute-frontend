import { create } from "zustand";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000, // 5 seconds default
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

// Hook for easy usage
export const useToast = () => {
  const { addToast, removeToast, clearToasts } = useToastStore();

  const toast = {
    success: (message: string, title?: string) =>
      addToast({ type: "success", message, title }),

    error: (message: string, title?: string) =>
      addToast({ type: "error", message, title }),

    warning: (message: string, title?: string) =>
      addToast({ type: "warning", message, title }),

    info: (message: string, title?: string) =>
      addToast({ type: "info", message, title }),
  };

  return {
    toast,
    removeToast,
    clearToasts,
  };
};
