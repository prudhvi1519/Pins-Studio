// Store is independent of React

export type ToastType = 'default' | 'success' | 'error';

export interface ToastConfig {
    id: string;
    message: string;
    type?: ToastType;
    duration?: number;
}

type ToastListener = (toasts: ToastConfig[]) => void;

class ToastStore {
    private toasts: ToastConfig[] = [];
    private listeners: Set<ToastListener> = new Set();
    private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

    subscribe(listener: ToastListener) {
        this.listeners.add(listener);
        // initial state
        listener(this.toasts);
        return () => { this.listeners.delete(listener); };
    }

    private notify() {
        this.listeners.forEach((l) => l(this.toasts));
    }

    add(toast: Omit<ToastConfig, 'id'>) {
        const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
        const newToast: ToastConfig = { ...toast, id };

        // Only keep up to 3 toasts at a time
        this.toasts = [...this.toasts, newToast].slice(-3);
        this.notify();

        const duration = toast.duration ?? 3000;
        if (duration > 0) {
            const timer = setTimeout(() => {
                this.remove(id);
            }, duration);
            this.timers.set(id, timer);
        }
    }

    remove(id: string) {
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
    }
}

export const toastStore = new ToastStore();

// Expose direct trigger mechanism
export const triggerToast = (config: Omit<ToastConfig, 'id'>) => {
    toastStore.add(config);
};
