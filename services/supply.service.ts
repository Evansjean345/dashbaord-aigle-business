import {api} from '@/lib/axios';
import {providerPayload, providersList, Supply, SupplyResponse} from '@/types/supply.types';

export const supplyService = {
    getProviders: async (data: providerPayload): Promise<providersList[]> => {
        try {
            const response = await api.get(`/provision/payment-method/${data.type}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Impossible de récupérer les opérateurs");
        }
    },
    getSupplies: async (organisation_id: string): Promise<Supply[]> => {
        try {
            const response = await api.get(`/provision/${organisation_id}`);
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer les demandes d'approvisionnement");
        }
    },
    createSupply: async (formData: FormData): Promise<SupplyResponse> => {
        try {
            const response = await api.post('/provision', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Impossible d'effectuer la demande d'approvisionnement");
        }
    }
}