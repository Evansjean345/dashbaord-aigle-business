import {useState} from "react";
import {useOrganisationStore} from "@/stores/organisationStore";
import {useOrganisationWallet} from "@/hooks/useOrganisation";
import {
    useAuthenticateForPayout,
    useMobileMoneyCountries,
    useMobileMoneyCountryOperators, useMobileMoneyDeposit, useTransactionCache, useWaveDeposit
} from "@/hooks/useTransaction";
import {useAlertStore} from "@/stores/useAlert";
import {CashoutTypeValue, Transaction} from "@/types/transaction.types";

export const useTransfertForm = (transfertCategory: CashoutTypeValue = "revenue") => {
    const [countryId, setCountryId] = useState<string | null>('CI');

    const {organisation} = useOrganisationStore();
    const {refreshOrganisationWallet} = useOrganisationWallet()
    const {authentication, authenticationLoading} = useAuthenticateForPayout()
    const {countries} = useMobileMoneyCountries()
    const {operators, isLoadingOperators} = useMobileMoneyCountryOperators(countryId)
    const {mobileMoneyDeposit, isMobileMoneyDepositLoading} = useMobileMoneyDeposit()
    const {waveDeposit, isWaveDepositLoading} = useWaveDeposit()
    const {updateTransactionFromCache} = useTransactionCache()

    const [isTransactionCompleted, setIsTransactionCompleted] = useState<boolean>(false);

    const showAlert = useAlertStore(state => state.showAlert)
    const closeAlert = useAlertStore(state => state.closeAlert)

    const [formData, setFormData] = useState({
        destinationNetwork: "",
        destinationNumber: "",
        amount: "",
        fees: null,
        country: countryId,
        operator: "",
        category: transfertCategory,
        password: ''
    });

    /**
     * Handles the selection of a country by updating the state.
     *
     * @param {any} country - The selected country. The parameter can be of any type.
     *
     * Updates the `countryId` state with the selected country's value.
     * Modifies the `formData` state by updating the `country` field with the selected country.
     */
    const handleCountrySelect = (country: any) => {
        setCountryId(country);
        setFormData(prev => ({...prev, country: country}))
    };

    /**
     * Asynchronously refreshes transaction data.
     *
     * @param {Transaction} transaction - The transaction to be refreshed
     */
    const refreshTransactionData = async (transaction: Transaction) => {
        await updateTransactionFromCache(transaction)
    }

    /**
     * Asynchronous function to process a financial transaction.
     *
     * This function processes transactions based on the specified operation type.
     * It handles mobile money transfers, supporting different providers and transaction categories.
     * Depending on the destination network, it either initiates a Wave deposit or a mobile money deposit.
     * The function provides feedback to the user through alerts and updates the relevant transaction data,
     * organisation wallet, and resets form data when necessary.
     *
     * Functionality:
     * - Constructs a payload object containing transaction details such as amount, currency, provider, number, country, and category.
     * - Detects the destination network from the input data and processes the transaction accordingly.
     * - If the destination network is "wave", it calls the `waveDeposit` method and performs necessary success actions:
     *   * Shows a success alert.
     *   * Refreshes transaction data.
     *   * Refreshes organisation wallet data.
     *   * Resets input form data after a delay.
     * - For other networks, it calls the `mobileMoneyDeposit` method and performs success actions:
     *   * Displays an info alert indicating the transaction has been initiated.
     *   * Stores the initiated transaction data.
     *
     * Prerequisites:
     * - Ensure the `formData`, `organisation`, `countryId`, `waveDeposit`, `mobileMoneyDeposit`, `showAlert`,
     *   `refreshTransactionData`, `refreshOrganisationWallet`, `setTransactionIniated`, and `handleResetData` are correctly initialized.
     * - The function makes use of asynchronous operations, ensure proper error handling during implementation.
     *
     * Note:
     * - The function assumes that the country ID is converted to lowercase for uniformity.
     * - Currency is hardcoded to "XOF".
     * - Feedback and data updates occur on successful transaction processing.
     */
    const proccessTransaction = async (token: string) => {
        const payload = {
            operation_type: "mobile_money",
            amount: formData.amount,
            provider: formData.destinationNetwork,
            number: formData.destinationNumber,
            country: countryId.toLowerCase(),
            currency: "XOF",
            organisation_id: organisation?.organisation_id,
            category: formData.category,
            transaction_token: token,
        };

        if (formData.destinationNetwork === 'wave') {
            waveDeposit(payload, {
                onSuccess: async (data: Transaction) => {
                    showAlert("Le transfert vers wave a été effectuer avec succès!", "success")
                    await refreshTransactionData(data)
                    await refreshOrganisationWallet()
                    setTimeout(() => {
                        setIsTransactionCompleted(true)
                        closeAlert()
                    }, 1000)
                }
            });
        } else {
            mobileMoneyDeposit(payload, {
                onSuccess: (data: Transaction) => {
                    showAlert("Votre transaction est en cours d'exécution", "info")
                    setTimeout(() => setIsTransactionCompleted(true), 1000)
                }
            });
        }
    }

    /**
     * An asynchronous function to handle form submission by constructing
     * a payload object with necessary details extracted from form data
     * and context.
     *
     * Fields included in the payload:
     * - `amount`: The amount value entered in the form.
     * - `number`: The destination number derived from the form field.
     * - `organisation_id`: The ID of the organisation, fetched from context.
     * - `category`: The category value selected in the form.
     * - `password`: The password provided in the form.
     *
     * This function prepares the payload for further processing, such as
     * API calls or other actions that need the submitted form data.
     */
    const handleSubmit = async () => {
        const payload = {
            amount: formData.amount.toString(),
            number: formData.destinationNumber,
            organisation_id: organisation?.organisation_id,
            password: formData.password
        };

        authentication(payload, {
            onSuccess: async (payload) => {
                if (payload.transaction_token) {
                    await proccessTransaction(payload.transaction_token)
                }
            },
            onError: (error) => {
                if (error.response) {
                    const message = error.response.status === 400
                        ? "Code pin incorrect"
                        : "Une erreur interne du serveur est survenue";
                    showAlert(message, "error");
                } else {
                    showAlert("Une erreur est survenue", "error");
                }
            }
        })
    }

    return {
        formData,
        setFormData,
        countries,
        operators,
        organisation,
        isLoadingOperators,
        mobileMoneyDeposit,
        isMobileMoneyDepositLoading,
        isTransactionCompleted,
        waveDeposit,
        isWaveDepositLoading,
        authentication,
        authenticationLoading,
        handleCountrySelect,
        handleSubmit
    }
}