import {api} from "@/lib/axios";
import {
    DepositPayload,
    mobileMoneyWithdrawPayload, PayoutAuthenticationPayload,
    Transaction,
    TransactionAnalyzeChart,
    TransactionFees,
    TransactionFeesRequestPayload,
    TransactionSummary,
    waveWithdrawPayload
} from '@/types/transaction.types';
import {useOrganisationStore} from "@/stores/organisationStore";
import {DateRange} from "react-day-picker";
import {formatISODate} from "@/lib/utils";
import {errorService} from "./error.service";

/**
 * A service for managing transactions and payment operations.
 */
export const transactionService = {
    /**
     * Retrieves a list of transactions for the active organization.
     * @returns {Promise<Transaction[]>} A Promise that resolves with an array of Transaction objects.
     */
    getTransactions: async (): Promise<Transaction[]> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;
            const response = await api.get(`/organisations/${activeOrganisation?.organisation_id}/transactions`);
            return response.data;
        } catch (error: any) {
            console.error('Transaction retrieval error:', error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer les transactions");
        }
    },
    /**
     * Retrieves a summary of the transactions for the active organisation.
     *
     * @returns {Promise<TransactionSummary>} A promise that resolves with an array of TransactionSummary objects.
     */
    getTransactionSummary: async (organisation_id: string): Promise<TransactionSummary> => {
        try {
            const response = await api.get(`/organisations/${organisation_id}/transactions/summary`);
            return response.data;
        } catch (error: any) {
            console.error('Transaction summary error:', error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer les transactions");
        }
    },

    /**
     * Retrieves transaction data for analysis related to a specific organisation.
     *
     * @param {string} organisation_id - The identifier of the organisation for which transaction data is to be retrieved.
     * @param dateRange
     * @returns {Promise} A promise that resolves with the transaction data for analysis.
     */
    getTransactionAnalyzeData: async (organisation_id: string, dateRange: DateRange): Promise<TransactionAnalyzeChart[]> => {
        const start_date = formatISODate(dateRange.from)
        const end_date = formatISODate(dateRange.to)

        try {
            const response = await api.get(`/organisations/${organisation_id}/transactions/chart?start_date=${start_date}&end_date=${end_date}`);
            return response.data;
        } catch
            (error: any) {
            throw new Error(error.response?.data?.message || "Impossible de récupérer les transactions");
        }
    },

    /**
     * Retrieves a transaction by its ID.
     *
     * @param {string} transactionId - The ID of the transaction to retrieve.
     * @returns {Promise<Transaction>} A promise that resolves with the retrieved Transaction object.
     * @throws {Error} Throws an error if the transaction retrieval fails.
     */
    getTransaction: async (transactionId: string): Promise<Transaction> => {
        try {
            const activeOrganisation = useOrganisationStore.getState().organisation;
            const response = await api.get(`/organisations/${activeOrganisation?.organisation_id}/transactions/${transactionId}`);
            return response.data;
        } catch (error: any) {
            console.error('Transaction detail error:', error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer la transaction");
        }
    },
    getCountries:
        async (): Promise<any[]> => {
            try {
                const response = await api.get('/mobile-money/countries');
                return response.data;
            } catch (error: any) {
                console.error('Countries retrieval error:', error);
                throw new Error(error.response?.data?.message || "Impossible de récupérer les pays");
            }
        },
    getOperators:
        async (countryId: string): Promise<any[]> => {
            try {
                const response = await api.get(`/mobile-money/countries/${countryId}/providers`);
                return response.data;
            } catch (error: any) {
                console.error('Operators retrieval error:', error);
                throw new Error(error.response?.data?.message || "Impossible de récupérer les opérateurs");
            }
        },
    mobileMoneyDeposit:
        async (payload: DepositPayload): Promise<Transaction> => {
            try {
                const response = await api.post('/paiements/v2/transfers', payload);
                return response.data;
            } catch (error: any) {
                console.error('Mobile Money deposit error:', error);
                throw new Error(error.response?.data?.message || "Le dépôt Mobile Money a échoué");
            }
        },
    mobileMoneyWithdraw:
        async (payload: mobileMoneyWithdrawPayload): Promise<Transaction> => {
            try {
                const response = await api.post('/paiements/checkout', payload);
                return response.data;
            } catch (error: any) {
                console.error('Mobile Money withdrawal error:', error);
                throw new Error(error.response?.data?.message || "Le retrait Mobile Money a échoué");
            }
        },
    waveDeposit:
        async (payload: DepositPayload): Promise<Transaction> => {
            try {
                const response = await api.post('/paiements/v2/transfers', payload);
                return response.data;
            } catch (error: any) {
                console.error('Wave deposit error:', error);
                throw new Error(error.response?.data?.message || "Le dépôt Wave a échoué");
            }
        },
    waveWithdraw:
        async (payload: waveWithdrawPayload): Promise<Transaction> => {
            try {
                const response = await api.post('/paiements/checkout', payload);
                return response.data;
            } catch (error: any) {
                console.error('Wave withdrawal error:', error);
                throw new Error(error.response?.data?.message || "Le retrait Wave a échoué");
            }
        },

    /**
     * Calculates transaction fees based on the provided payload.
     * @param {TransactionFeesRequestPayload} payload - The payload containing the necessary information for calculating transaction fees.
     * @returns {Promise<TransactionFees>} - A Promise that resolves to the calculated transaction fees.
     * @throws {Error} - If an error occurs during the fee calculation process.
     */
    calculateTransactionFees: async (payload: TransactionFeesRequestPayload): Promise<TransactionFees> => {
        try {
            const response = await api.post("/fees", payload)
            return response.data
        } catch (error: any) {
            console.error('Transaction fees calculation error:', error);
            throw new Error(error.response?.data?.message || "Impossible de calculer les frais de transaction");
        }
    },

    /**
     * Fetches all smart kbine transactions for a specific organisation.
     *
     * @param {string} organisationId - The identifier of the organisation to fetch transactions for.
     * @returns {Promise<Transaction[]>} - A promise that resolves to an array of Transaction objects representing the transactions.
     */
    getSmartKbineTransactions: async (organisationId: string): Promise<Transaction[]> => {
        try {
            const response = await api.get(`/kbine-smart/${organisationId}/transactions`);
            return response.data
        } catch (error: any) {
            console.error('Smart Kbine transactions error:', error);
            throw new Error(error.response?.data?.message || "Impossible de récupérer les transactions Smart Kbine");
        }
    },
    /**
     * Handles payout authentication process.
     *
     * @async
     * @function
     * @param {PayoutAuthenticationPayload} payload - The payload containing necessary data for processing payout authentication.
     * @returns {Promise<any>} A promise that resolves with the result of the payout authentication process.
     */
    payoutAuthentication: async (payload: PayoutAuthenticationPayload): Promise<any> => {
        try {
            const response = await api.post(`/paiements/authentication`, payload);
            return response.data
        } catch (error: any) {
            console.error('Payout authentication error:', error);
            throw new Error(error.response?.data?.message || "L'authentification pour le paiement a échoué");
        }
    }
};
