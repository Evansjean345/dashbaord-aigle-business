import {
    createPayload,
    CreditSubOrganisationPayload,
    DebitSubOrganisationPayload,
    deletePayload,
    updatePayload,
    updateStatusPayload
} from "@/types/organisation.types";
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {organisationService} from '@/services/organisation.service';
import {authService} from "@/services/auth.service";
import {useAuthStore} from "@/stores/authStore";
import {useOrganisationStore} from "@/stores/organisationStore";
import {useAlertStore} from "@/stores/useAlert";

/**
 * Custom hook `useCreateOrganisation` for creating a new organization.
 *
 * This hook provides a mutation function to create an organization and returns
 * additional state information about the creation process. It leverages `react-query`
 * for managing the mutation and invalidates the relevant queries upon successful
 * execution. Additionally, error handling is included to manage API responses.
 *
 * @returns An object containing:
 * - `createOrganisation`: A mutation function to initiate the organization creation process.
 * - `isCreatingOrganisation`: Boolean indicating if the creation process is in progress.
 */
export const useCreateOrganisation = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    /**
     * Function to create a new organization with provided details.
     *
     * @param {string} name - The name of the organization.
     * @param {string} location - The location of the organization.
     * @param {number} foundingYear - The founding year of the organization.
     * @returns {Object} - Returns the newly created organization object.
     */
    const {mutate: createOrganisation, isPending: isCreatingOrganisation} = useMutation({
        mutationFn: (payload: createPayload) => organisationService.createOrganisation(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['organisations']})
            showAlert("Compte professionnel créé avec succès", "success")
        },
        onError: (error) => {
            if (error && error.response.status === 442) {
                throw error;
            } else {
                showAlert(error.message || "Une erreur s'est produite lors de la création de l'organisation", "error")
            }
        }
    })

    return {createOrganisation, isCreatingOrganisation}
}
/**
 * Custom hook to provide functionality for updating an organisation's information.
 *
 * This hook leverages a mutation to interact with the organisation service for updating an organisation's details.
 * Upon success, it invalidates the relevant query cache to ensure updated data is reflected and shows a success alert.
 * On failure, it handles errors appropriately and displays an error alert with a corresponding message.
 *
 * @returns An object containing:
 * - `updateOrganisation` (function): A function to trigger the organisation update mutation with the appropriate payload.
 * - `isUpdatingOrganisation` (boolean): A boolean indicating the pending status of the update operation.
 */
export const useUpdateOrganisation = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    /**
     * Function to update an organisation's information in the database
     *
     * @param {number} id - The ID of the organisation to be updated
     * @param {string} name - The new name of the organisation
     * @param {string} email - The new email address of the organisation
     * @param {string} address - The new address of the organisation
     * @returns {boolean} - True if the organisation was successfully updated, false otherwise
     */
    const {mutate: updateOrganisation, isPending: isUpdatingOrganisation} = useMutation({
        mutationFn: (payload: updatePayload) => organisationService.updateOrganisation(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['organisations']});
            showAlert("Le compte professionnel a bien été mise à jour avec succès!", "success")
        },
        onError: (error) => {
            if (error && error.response.status === 442) {
                throw error;
            } else {
                showAlert(error.message || "Une erreur s'est produite lors de la mise à jour de l'organisation", "error")
            }
        }
    });

    return {updateOrganisation, isUpdatingOrganisation}
}
/**
 * Custom hook for updating the status of an organisation.
 *
 * Provides functionality to perform an asynchronous mutation for updating the status of an organisation
 * and manages the state of the operation using the `react-query` and custom alert store.
 *
 * @function useUpdateOrganisationStatus
 * @returns An object containing the following properties:
 * - `updateStatusOrganisation` {function}: A mutation function to update the organisation's status, accepting a payload of type `updateStatusPayload`.
 * - `isUpdatingStatusOrganisation` {boolean}: A boolean flag indicating whether the mutation operation is pending.
 */
export const useUpdateOrganisationStatus = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: updateStatusOrganisation, isPending: isUpdatingStatusOrganisation} = useMutation({
        mutationFn: (payload: updateStatusPayload) => organisationService.updateStatusOrganisation(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['organisations']});
            showAlert("Le statut du compte professionnel a bien été mis à jour avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible de mettre à jour le statut du compte professionnel", "error")
        }
    });

    return {updateStatusOrganisation, isUpdatingStatusOrganisation}
}
/**
 * A hook that provides functionality to debit a sub-organization's account.
 * It uses a mutation function to perform the operation and handles success
 * and error responses. On successful debit, the relevant query cache is invalidated,
 * and a success alert is displayed. In the case of an error, an error alert is triggered.
 *
 * @function
 * @returns An object containing the mutation function `debitSubOrganisation`
 * for debiting a sub-organization and a boolean state `isDebitSubOrganisation` indicating
 * if the mutation operation is currently in progress.
 */
export const useDebitSubOrganisation = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: debitSubOrganisation, isPending: isDebitSubOrganisation} = useMutation({
        mutationFn: (payload: DebitSubOrganisationPayload) => organisationService.debitSubOrganisation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['organisations']});
            showAlert("Le solde du compte professionnel a bien été débiter avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible de débiter le compte professionnel", "error")
        }
    });

    return {debitSubOrganisation, isDebitSubOrganisation}
}
/**
 * useCreditSubOrganisation
 *
 * This is a React hook that provides functionality to credit a sub-organisation's account balance.
 * It leverages the `useMutation` hook to handle the mutation logic and exposes the mutation function
 * along with a boolean indicating if the mutation is currently in progress.
 *
 * The mutation function (`creditSubOrganisation`) is called with a payload of type `CreditSubOrganisationPayload`
 * and interacts with the `organisationService` to perform the crediting operation.
 *
 * Upon successful completion of the mutation:
 * - Invalidates the "organisations" query cache to ensure data consistency.
 * - Displays a success alert indicating the completion of the operation.
 *
 * If an error occurs during the mutation:
 * - Displays an error alert with the error message or a fallback message
 *   if no specific error message is available.
 *
 * @returns Returns an object containing the following:
 * - `creditSubOrganisation` (Function): The mutation function to credit the sub-organisation.
 * - `isCreditSubOrganisation` (Boolean): A boolean indicating whether the mutation is currently in progress.
 */
export const useCreditSubOrganisation = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: creditSubOrganisation, isPending: isCreditSubOrganisation} = useMutation({
        mutationFn: (payload: CreditSubOrganisationPayload) => organisationService.creditSubOrganisation(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['organisations']});
            showAlert("Le solde du compte professionnel a bien été crediter avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible de créditer le compte professionnel", "error")
        }
    });

    return {creditSubOrganisation, isCreditSubOrganisation}
}
/**
 * Custom hook to handle the deletion of an organisation.
 *
 * This hook provides functionality to delete an organisation using a mutation, manage the loading state during the deletion process,
 * and display success or error alerts based on the outcome of the mutation.
 *
 * Returns an object containing:
 * - `deleteOrganisation`: A mutate function to initiate the deletion process.
 * - `isDeletingOrganisation`: A boolean indicating whether the deletion process is currently in progress.
 *
 * The hook invalidates the 'organisations' query on successful deletion to ensure that the relevant data is up-to-date.
 * Success and error alerts are displayed to notify the user about the operation's outcome.
 */
export const useDeleteOrganisation = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: deleteOrganisation, isPending: isDeletingOrganisation} = useMutation({
        mutationFn: (payload: deletePayload) => organisationService.deleteOrganisation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['organisations']});
            showAlert("Le compte professionnel a bien été supprimer avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible de supprimer le compte professionnel", "error")
        }
    });

    return {deleteOrganisation, isDeletingOrganisation}
}
/**
 * A hook function that handles the mutation for deleting an organisation using a code pin.
 * It uses the `useMutation` hook to perform the mutation and manages the API call made to
 * delete an organisation via the `organisationService`.
 *
 * The mutation function, `setCodePin`, sends the required payload to delete an organisation.
 * Upon successful deletion, the cached organisations data is invalidated, and a success
 * alert message is displayed. If an error occurs during the deletion process, an error
 * alert message is displayed.
 */
export const useOrganisationSetCodePin = () => {
    const showAlert = useAlertStore(state => state.showAlert);

    const {mutate: setCodePin, isPending: isCodePinSet} = useMutation({
        mutationFn: async (payload: {
            password: string,
            organisationId: string
        }) => await organisationService.setOrganisationCodePin(payload),
        onSuccess: () => {
            showAlert("Code PIN défini avec succès", "success");
        },
        onError: (error: Error) => {
            console.error('Organisation code PIN error:', error);
            showAlert(error.message || "Impossible de définir le code PIN", "error");
        }
    });

    return {setCodePin, isCodePinSet}
}

/**
 * Custom hook to manage and interact with the organisation's wallet data.
 * Provides functionality to refresh the wallet information for the currently active organisation.
 *
 * @return An object containing the `refreshOrganisationWallet` method.
 */
export function useOrganisationWallet() {
    const organisation = useOrganisationStore(state => state.organisation);
    const setUpdateOrganisationWallet = useOrganisationStore(state => state.updateOrganisationWallet)

    /**
     * Function to refresh the wallet of the currently active organisation.
     * Retrieves the organisation's wallet information using the organisation_id,
     * then updates the organisation's wallet state using the retrieved wallet data.
     * This function is asynchronous.
     * @returns {Promise<void>}
     */
    const refreshOrganisationWallet = async (): Promise<void> => {
        const wallet = await organisationService.getOrganisationWallet(organisation?.organisation_id)
        setUpdateOrganisationWallet(wallet)
    }

    return {refreshOrganisationWallet}
}

/**
 * A hook that provides organisation-related data and loading state.
 *
 * The `useOrganisation` hook retrieves the active organisation
 * from the store and fetches the list of organisations using a
 * query. The query is enabled only if an active organisation ID
 * exists. It returns the fetched organisations and their loading state.
 *
 * @returns An object containing:
 * - `organisations`: The data of fetched organisations.
 * - `isLoadingOrganisations`: A boolean indicating the loading state of the organisations query.
 */
export const useOrganisation = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation);

    const {data: organisations, isLoading: isLoadingOrganisations} = useQuery({
        queryKey: ['organisations'],
        queryFn: () => organisationService.getOrganisations(),
        enabled: !!activeOrganisation?.organisation_id,
    });

    return {organisations, isLoadingOrganisations};
};

/**
 * Retrieves authenticated user's organisations from the server.
 * @returns {{
 *   authOrganisations: any, // Retrieved organisations data
 *   isAuthOrganisationLoading: boolean // Indicates whether the data is currently loading
 * }}
 */
export const useAuthOrganisations = (): {
    authOrganisations: any; // Retrieved organisations data
    isAuthOrganisationLoading: boolean; // Indicates whether the data is currently loading
} => {
    const {data: authOrganisations, isLoading: isAuthOrganisationLoading} = useQuery({
        queryKey: ['userOrganisation'],
        queryFn: async () => await authService.getAuthenticatedUserOrganisation(),
        enabled: useAuthStore.getState().isAuthenticated
    })

    return {
        authOrganisations, isAuthOrganisationLoading
    }
}
