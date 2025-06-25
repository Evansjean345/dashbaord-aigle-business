// services/error.service.ts
import { useAlertStore } from "@/stores/useAlert";

export const errorService = {
    handleError: (error: any, defaultMessage: string = "Une erreur est survenue") => {
        console.error('Application error:', error);
        const message = error.message || defaultMessage;
        
        // Accéder au store directement pour les services
        const showAlert = useAlertStore.getState().showAlert;
        showAlert(message, "error");
        
        // Retourner le message pour les cas où on veut faire quelque chose de spécifique
        return message;
    }
};