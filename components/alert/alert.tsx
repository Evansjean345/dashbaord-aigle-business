import {Button, Modal, ModalBody, ModalContent, Spinner} from "@heroui/react";
import {AlertCircleIcon, TickDouble03Icon} from "hugeicons-react";
import {ReactNode} from "react";
import {useAlertStore} from "@/stores/useAlert";

export type AlertStatus = "loading" | "success" | "error" | "info";

interface AlertProps {
    isOpen: boolean;
    onClose: () => void;
    status: AlertStatus;
    message: ReactNode;
}

export const Alert = () => {
    const alert = useAlertStore(state => state.alertState)
    const closeAlert = useAlertStore(state => state.closeAlert)

    const renderContent = () => {
        switch (alert.status) {
            case "loading":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner size="lg" color="primary"/>
                        <div className="text-center">Traitement en cours...</div>
                    </div>
                );

            case "info":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Spinner size="lg" color="primary"/>
                        <div className="text-center">{alert.message}</div>
                    </div>
                );
            case "success":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <TickDouble03Icon className="w-12 h-12 text-success"/>
                        <div className="text-center text-success">{alert.message}</div>
                        <Button color="success" variant="light" onPress={() => closeAlert()}>
                            Fermer
                        </Button>
                    </div>
                );
            case "error":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <AlertCircleIcon className="w-12 h-12 text-danger"/>
                        <div className="text-center text-danger">{alert.message}</div>
                        <Button color="danger" variant="light" onPress={() => closeAlert()}>
                            Fermer
                        </Button>
                    </div>
                );
        }
    };

    return (
        <Modal placement="center" isOpen={alert.isOpen} onClose={() => closeAlert()} size="sm">
            <ModalContent>
                <ModalBody className="py-6">
                    {renderContent()}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
