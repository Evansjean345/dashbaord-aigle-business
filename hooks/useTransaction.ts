import {
    AirtimeTransaction,
    DepositPayload,
    mobileMoneyWithdrawPayload, PayoutAuthenticationPayload,
    Transaction,
    waveWithdrawPayload
} from "@/types/transaction.types";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {transactionService} from "@/services/transaction.service";
import {useAlertStore} from "@/stores/useAlert";
import Error from "next/error";

/**
 * Function to fetch a list of mobile money countries using useQuery
 *
 */
export const useMobileMoneyCountries = () => {
    const {data: countries, isLoading: isLoadingCountries} = useQuery({
        queryKey: ["mobile-money-countries"],
        queryFn: transactionService.getCountries,
    });

    return {countries, isLoadingCountries}
}

/**
 * Function that retrieves mobile money operators for a specified country.
 *
 * @param {string} countryId - The unique identifier for the country.
 */
export const useMobileMoneyCountryOperators = (countryId: string) => {
    const {data: operators, isLoading: isLoadingOperators} = useQuery({
        queryKey: ["operators", countryId],
        queryFn: () => transactionService.getOperators(countryId),
        enabled: !!countryId,
    });

    return {operators, isLoadingOperators}
}

/**
 * Executes a mobile money deposit transaction.
 * Uses useQueryClient to manage queries, and useAlert to manage alert states.
 *
 * @returns An object containing the mobileMoneyDeposit function and a boolean flag isPending indicating if the deposit transaction is currently pending.
 */
export const useMobileMoneyDeposit = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: mobileMoneyDeposit, isPending: isMobileMoneyDepositLoading} = useMutation({
            mutationFn: (payload: DepositPayload) => transactionService.mobileMoneyDeposit(payload),
            onSuccess: async (data: Transaction, _: DepositPayload, __: unknown) => {
                await queryClient.invalidateQueries({queryKey: ["transactions"]});
                return data
            },
            onError: (error: Error, transaction, context) => showAlert(error.message || "Impossible d'effectuer le transfert vers mobile money'", "error")
        })
    ;

    return {mobileMoneyDeposit, isMobileMoneyDepositLoading}
}

/**
 * Function to perform a mobile money withdrawal transaction.
 *
 */
export const useMobileMoneyWithdraw = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: mobileMoneyWithdraw, isPending: isMobileMoneyWithdrawLoading} = useMutation({
        mutationFn: (payload: mobileMoneyWithdrawPayload) => transactionService.mobileMoneyWithdraw(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
            showAlert("Le Retrait mobile money a été effectuer avec succès!", "success")
        },
        onError: (error: Error) => showAlert(error.message || "Impossible d'effectuer le retrait mobile money", "error")
    });

    return {mobileMoneyWithdraw, isMobileMoneyWithdrawLoading}
}

/**
 * Custom hook for performing a wave deposit transaction through a mutation.
 * This hook utilizes useQueryClient and useAlert custom hooks for managing state and displaying alerts.
 * The waveDeposit function is provided to initiate the mutation for wave deposit transaction.
 * isWaveDepositLoading indicates whether the wave deposit mutation is currently pending.
 * Any error during the transaction will display an alert message using useAlert custom hook.
 *
 */
export const useWaveDeposit = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: waveDeposit, isPending: isWaveDepositLoading} = useMutation({
        mutationFn: (payload: DepositPayload) => transactionService.waveDeposit(payload),
        onSuccess: async (data: Transaction, _: DepositPayload, __: unknown) => {
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
            return data
        },
        onError: (error: Error) => showAlert(error.message || "Impossible d'effectuer le transfert vers wave", "error")
    });

    return {waveDeposit, isWaveDepositLoading}
}

/**
 * Custom hook for performing a deposit or withdrawal transaction using Wave API.
 * This hook utilizes queryClient and alert store to handle data fetching and display messages.
 *
 */
export const useWaveDepositWithdraw = () => {
    const queryClient = useQueryClient();
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: waveWithdraw, isPending: isWaveWithdrawLoading} = useMutation({
        mutationFn: (payload: waveWithdrawPayload) => transactionService.waveWithdraw(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["transactions"]});
            showAlert("Le retrait depuis wave a été effectuer avec succès!", "success")
        },
        onError: (error: Error) => {
            showAlert(error.message || "Impossible d'effectuer le retrait depuis wave", "error")
        }
    });

    return {waveWithdraw, isWaveWithdrawLoading}
}

/**
 * Manages caching of transaction data in the query client.
 *
 * @returns Object containing two functions for adding and updating transactions in the cache.
 */
export function useTransactionCache() {
    const queryClient = useQueryClient();

    /**
     * Adds a transaction to the cache.
     *
     * @param {Transaction | AirtimeTransaction} transaction - The transaction to be added to the cache.
     */
    const addTransactionToCache = (transaction: Transaction | AirtimeTransaction) => {
        queryClient.setQueryData(['transactions'], (oldData: Transaction[]) => [transaction, ...oldData]);
    }

    /**
     * Updates a transaction in the cache with the provided updated transaction object.
     *
     * @param {Transaction | AirtimeTransaction} updatedTransaction - The transaction object to update in the cache.
     */
    const updateTransactionFromCache = async (updatedTransaction: Transaction | AirtimeTransaction) => {
        queryClient.setQueryData(['transactions'], (oldData: Transaction[]) => {
            return oldData.map((oldTransaction: Transaction | AirtimeTransaction) => {
                if (oldTransaction.id === updatedTransaction.id) {
                    return updatedTransaction;
                } else {
                    return oldTransaction;
                }
            });
        });
    }

    /**
     * Asynchronously invalidates queries related to transactions and organisation wallet.
     * This function invalidates the "transactions" and "organisationWallet" queries using queryClient.
     * @returns {Promise<void>} A Promise that resolves once both queries are invalidated.
     */
    const refreshTransactions = async (): Promise<void> => {
        await queryClient.invalidateQueries({queryKey: ["transactions"]})
    };

    return {addTransactionToCache, updateTransactionFromCache, refreshTransactions};
}

/**
 * Custom React hook to fetch and manage transaction data.
 * This hook utilizes the `useQuery` hook from the React Query library to fetch transaction data asynchronously.
 * It provides the fetched transaction data and loading state to the consuming component.
 *
 * @function useTransaction
 * @property {Array} transactions - The fetched transaction data.
 * @property {boolean} isLoadingTransactions - The loading state indicating whether the transaction data is being fetched.
 */
export const useTransaction = () => {
    const {data: transactions, isLoading: isLoadingTransactions} = useQuery({
        queryKey: ["transactions"],
        queryFn: async () => await transactionService.getTransactions()
    });

    return {
        transactions,
        isLoadingTransactions
    };
};
/**
 * A custom hook that handles the authentication process for payout transactions using the Wave service.
 *
 * This hook utilizes the `useMutation` function to execute a transaction service mutation.
 * It provides methods for handling successful and failed authentication attempts.
 *
 * @returns An object containing the `authentication` function and `authenticationLoading` state.
 * - `authentication`: Function to initiate the payout authentication process by invoking the transaction service.
 * - `authenticationLoading`: Boolean indicating the loading status of the authentication request.
 */
export const useAuthenticateForPayout = () => {
    const showAlert = useAlertStore(state => state.showAlert);

    const {mutate: authentication, isPending: authenticationLoading} = useMutation({
        mutationFn: async (payload: PayoutAuthenticationPayload) => await transactionService.payoutAuthentication(payload),
        onSuccess: async () => {

        },
        onError: (error: Error) => {
            console.error('Authentication error:', error);
            showAlert(error.message || "Échec de l'authentification pour le paiement", "error");
        }
    })

    return {
        authentication, authenticationLoading
    }
}
