import {recharcheResponse, rechargePayload} from "@/types/airtimes.types";
import {useMutation, useQuery} from "@tanstack/react-query";
import {airtimesService} from '@/services/airtimes.service';
import {AirtimeQrCodeCreated} from "@/types/organisation.types";
import {useAlertStore} from "@/stores/useAlert";

/**
 * Retrieves information about airtime countries.
 *
 * This function internally uses React Query hooks to fetch the list of countries
 * from the server. It uses the 'airtime-countries' query key to uniquely identify
 * this data fetching operation.
 */
export const useAirtimeCountries = () => {
    const {data: countries, isLoading: isLoadingCountries} = useQuery({
        queryKey: ["airtime-countries"],
        queryFn: () => airtimesService.getCountries(),
    });

    return {countries, isLoadingCountries}
}
/**
 * Retrieve a list of operators for a specific country from the airtime service.
 *
 * @param {string} countryId - The identifier of the country for which operators are being retrieved.
 */
export const useAirtimeCountryOperators = (countryId: string) => {
    const {data: operators, isLoading: isLoadingOperators} = useQuery({
        queryKey: countryId ? ["operators", countryId] : ["operators"],
        queryFn: () => airtimesService.getOperators(countryId),
        enabled: !!countryId,
    });

    return {operators, isLoadingOperators}
}

/**
 * Function that allows the user to recharge airtimes.
 * It utilizes the useAlertStore hook to handle showing alerts.
 * It also uses the useMutation hook to perform the recharge operation.
 *
 * @returns void
 */
export const useRechargeAirtimes = () => {
    const showAlert = useAlertStore(state => state.showAlert)

    const {mutate: recharge, isPending: isRechargePending} = useMutation({
        mutationFn: (payload: rechargePayload) => airtimesService.addAirtime(payload),
        onSuccess: (response: recharcheResponse, variables: rechargePayload) => {
            if (typeof window !== "undefined" && variables.sender.provider === "wave") {
                const waveUrl = response.transactionDetails.senderDetails.wave_url_launch;
                if (waveUrl) {
                    window.open(waveUrl, '_blank');
                }

                showAlert("Veuillez valider la transaction avec Wave", "info")
                return;
            }

            showAlert("Votre achat est en cours de traitement", "info")
        },
        onError: (error: Error) => showAlert(error.message || "Impossible d'effectuer le rechargement", "error"),
    });

    return {recharge, isRechargePending}
}

