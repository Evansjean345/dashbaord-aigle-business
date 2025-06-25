import {Countries, Operators, recharcheResponse, rechargePayload} from "@/types/airtimes.types";
import {api} from "@/lib/axios";
import {useOrganisationStore} from "@/stores/organisationStore";

export const airtimesService = {
    getCountries: async (): Promise<Countries[]> => {
        try {
            const response = await api.get('/airtimes/countries');
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer les pays");
        }
    },
    getOperators: async (countryCode: string): Promise<Operators[]> => {
        try {
            const response = await api.get(`/airtimes/countries/${countryCode}/operators?dataOnly=false&bundlesOnly=false&includeData=false&includeBundles=false`);
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer les opérateurs");
        }
    },
    addAirtime: async (payload: rechargePayload): Promise<recharcheResponse> => {
        try {
            const response = await api.post('/services/airtimes/recharge', payload);
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.response?.data?.message || "Impossible recharger de recharger le compte");
        }
    },
    createSmartkbine: async (): Promise<any> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;
            const response = await api.post('/kbine-smart/create', {
                organisation_id: activeOrganisation?.organisation_id
            });
            return response.data;
        } catch (error: any) {
            throw error
        }
    }
};