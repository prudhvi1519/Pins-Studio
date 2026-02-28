import { useCallback } from 'react';
import { triggerToast, type ToastConfig } from './toastStore';

export function useToast() {
    const toast = useCallback(
        (props: Omit<ToastConfig, 'id'> | string) => {
            if (typeof props === 'string') {
                triggerToast({ message: props, type: 'default', duration: 3000 });
            } else {
                triggerToast({
                    message: props.message,
                    type: props.type ?? 'default',
                    duration: props.duration ?? 3000,
                });
            }
        },
        []
    );

    return { toast };
}
