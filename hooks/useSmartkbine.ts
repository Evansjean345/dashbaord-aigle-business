import {useAlertStore} from "@/stores/useAlert";
import {useMutation, useQuery} from "@tanstack/react-query";
import {airtimesService} from "@/services/airtimes.service";
import {AirtimeQrCodeCreated} from "@/types/organisation.types";
import {transactionService} from "@/services/transaction.service";
import {useOrganisationStore} from "@/stores/organisationStore";

/**
 * This function hooks into the useAlertStore to display alerts and utilizes the useMutation hook
 * to create a Smartkbine account asynchronously. It returns the createSmartkbine function and a boolean
 * indicating whether the creation process is pending or not.
 */
export const useCreateSmartkbine = () => {
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: createSmartkbine, isPending: isCreateSmartkbinePending} = useMutation({
        mutationFn: async () => await airtimesService.createSmartkbine(),
        onSuccess: (data: AirtimeQrCodeCreated) => showAlert("Compte Smartkbine créé avec succès !", "success"),
        onError: (error) => showAlert(error.response ? error.response.data.message : error.message, "error")
    });

    return {createSmartkbine, isCreateSmartkbinePending}
}

/**
 * Fetches SmartKbine transactions for the active organisation.
 *
 * This function queries the backend to retrieve SmartKbine transactions for the active organisation.
 * The transactions are processed to ensure that the payment details are in a consistent format.
 *
 */
export const useSmartkbineTransactions = () => {
    const activeOrganisation = useOrganisationStore.getState().organisation;

    const {data: transactions, isLoading: isLoadingTransactions} = useQuery({
        queryKey: ["smartkbine-transactions"],
        queryFn: async () => {
            return await transactionService.getSmartKbineTransactions(activeOrganisation.organisation_id)
        }
    });

    return {transactions, isLoadingTransactions};
};