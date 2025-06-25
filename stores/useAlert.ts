import {AlertStatus} from '@/components/alert/alert';
import {create} from 'zustand';
import {ReactNode} from "react";

interface AlertState {
    isOpen: boolean;
    status: AlertStatus | null;
    message: ReactNode;
}

interface UseAlert {
    alertState: AlertState;
    showAlert: (message: ReactNode, status: AlertStatus, autoClose?: boolean) => void;
    closeAlert: () => void;
}

export const useAlertStore = create<UseAlert>((set) => ({
    alertState: {
        isOpen: false,
        status: 'info',
        message: ''
    },
    showAlert: (message: ReactNode, status: AlertStatus = 'info', autoClose = false) => {
        set({
            alertState: {
                isOpen: true,
                status,
                message
            }
        });

        if (autoClose) {
            setTimeout(() => {
                set({
                    alertState: {
                        isOpen: false,
                        status: null,
                        message: null
                    }
                });
            }, 3000)
        }
    },
    closeAlert: () => {
        set({
            alertState: {
                isOpen: false,
                status: null,
                message: null
            }
        });
    },
}));