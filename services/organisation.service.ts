import {api} from '@/lib/axios';
import {
    createPayload,
    CreditSubOrganisationPayload,
    DebitSubOrganisationPayload,
    deletePayload,
    Organisation,
    updatePayload,
    updateStatusPayload
} from '@/types/organisation.types';
import {useOrganisationStore} from "@/stores/organisationStore";
import { errorService } from "./error.service";

export const organisationService = {
    /**
     * Retrieves the list of sub-organisations associated with the current user's organisation.
     *
     * @async
     * @returns {Promise<Organisation[]>} A Promise that resolves with an array of Organisation objects representing the sub-organisations.
     * @throws {Error} Throws an error with a message if the retrieval fails.
     */
    getOrganisations: async (): Promise<Organisation[]> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;
            const response = await api.get(`/organisations/${activeOrganisation?.organisation_id}/sub-organisations`);
            return response.data;
        } catch (error: any) {
            console.error('Organisations retrieval error:', error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer le compte professionnel");
        }
    },
    /**
     * Retrieves the wallet information for a specific organisation.
     *
     * @param {string} organisation_id - The ID of the organisation for which the wallet information is to be retrieved.
     * @returns {Promise<any>} A promise that resolves with the wallet information of the specified organisation.
     * @throws {Error} If there is an error while retrieving the wallet information.
     */
    getOrganisationWallet: async (organisation_id: string): Promise<any> => {
        try {
            const response = await api.get(`/organisations/${organisation_id}/wallets`);
            return response.data;
        } catch (error: any) {
            console.error('Organisation wallet retrieval error:', error);
            throw new Error(error.response?.data?.message || "Une erreur est survenue");
        }
    },

    /**
     * Creates a new organization using the provided data.
     *
     * @param {createPayload} data The data containing information for creating the organization.
     * @return {Promise<Organisation>} A promise that resolves with the created organization.
     * @throws {Error} If there was an issue creating the organization, with an appropriate error message.
     */
    createOrganisation: async (data: createPayload): Promise<Organisation> => {
        try {
            const response = await api.post('/organisations', data);
            return response.data;
        } catch (error: any) {
            console.error('Organisation creation error:', error);
            throw new Error(error.response?.data?.message || "Impossible de créer le compte professionnel");
        }
    },

    /**
     * Update the information of the current organisation.
     *
     * @param {updatePayload} data - The data containing the new information for the organisation to be updated.
     * @returns {Promise<Organisation>} - The updated organisation after the operation.
     */
    updateOrganisation: async (data: updatePayload): Promise<Organisation> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;

            if (activeOrganisation.organisation_id !== data.organisationId) {
                throw new Error("Vous n'avez pas le droit de modifier cette organisation");
            }
            const response = await api.put(`/organisations/${data.organisationId}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Organisation update error:', error);
            throw new Error(error.response?.data?.message || "Impossible de modifier le compte professionnel");
        }
    },

    /**
     * Updates the status of an organisation.
     *
     * @param {updateStatusPayload} data - The payload containing the organisation ID and status information.
     * @returns {Promise<Organisation>} - A promise that resolves with the updated organisation data.
     * @throws {Error} - If there is an error updating the status, an error is thrown with a message.
     */
    updateStatusOrganisation: async (data: updateStatusPayload): Promise<Organisation> => {
        try {
            const response = await api.put(`/organisations/${data.organisationId}/status`, data);
            return response.data;
        } catch (error: any) {
            console.error('Organisation status update error:', error);
            throw new Error(error.response?.data?.message || "Impossible de modifier le statut le compte professionnel");
        }
    },

    /**
     * Credits the specified sub-organisation with the provided payload data.
     *
     * @param {CreditSubOrganisationPayload} data - The payload data for crediting the sub-organisation.
     * @returns {Promise<Organisation>} - The updated organisation information after crediting.
     * @throws {Error} - Throws an error with a message if the operation fails.
     */
    creditSubOrganisation: async (data: CreditSubOrganisationPayload): Promise<Organisation> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;
            const response = await api.post(`/organisations/${activeOrganisation.organisation_id}/sub-organisations/${data.sub_organisation_id}/fund`, data);
            return response.data;
        } catch (error: any) {
            console.error('Sub-organisation credit error:', error);
            throw new Error(error.response?.data?.message || "Impossible de créditer le compte professionnel");
        }
    },

    /**
     * Debits the specified sub-organisation from the active organisation.
     *
     * @param {DebitSubOrganisationPayload} data - The payload containing the sub-organisation ID and any other necessary data for the debit operation.
     * @returns {Promise<Organisation>} - A Promise that resolves to the updated Organisation object after the debit operation.
     * @throws {Error} - If an error occurs during the debit operation, an error is thrown with the corresponding error message.
     */
    debitSubOrganisation: async (data: DebitSubOrganisationPayload): Promise<Organisation> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;
            const response = await api.post(`/organisations/${activeOrganisation?.organisation_id}/sub-organisations/${data.sub_organisation_id}/debit`, data);
            return response.data;
        } catch (error: any) {
            console.error('Sub-organisation debit error:', error);
            throw new Error(error.response?.data?.message || "Impossible de débiter le compte professionnel");
        }
    },

    /**
     * Deletes an organisation based on the provided deletePayload.
     *
     * @param {deletePayload} data The payload containing the organisationId to be deleted.
     * @returns {Promise<Organisation>} A promise that resolves to the deleted Organisation.
     * @throws Throws an error if the active organisation does not match the one to be deleted,
     * or if an error occurs during the deletion process.
     */
    deleteOrganisation: async (data: deletePayload): Promise<Organisation> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;
            if (activeOrganisation.organisation_id !== data.organisationId) {
                throw new Error("Vous n'avez pas le droit de supprimer ce compte professionnel");
            }
            const response = await api.delete(`/organisations/${data.organisationId}`);
            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.response?.data?.message || "Impossible de supprimer le compte professionnel");
        }
    },

    /**
     * Deletes the organisation PIN for the specified organisation ID after verifying access rights.
     *
     * @async
     * @function setOrganisationCodePin
     * @param {deletePayload} data - The payload containing information needed to delete the organisation PIN.
     * @param {string} data.organisationId - The ID of the organisation whose PIN needs to be deleted.
     * @returns {Promise<void>} A promise that resolves to the deleted organisation data.
     * @throws {Error} Throws an error if the user does not have rights to delete the specified organisation's PIN
     *                 or if the deletion request fails.
     */
    setOrganisationCodePin: async (data: { password: string, organisationId: string }): Promise<void> => {
        try {
            const response = await api.put(`/organisations/${data.organisationId}/password`, {
                password: data.password,
            });
            return response.data;
        } catch (error: any) {
            throw error;
        }
    }
}
