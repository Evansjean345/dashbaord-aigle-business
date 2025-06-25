import {useState} from "react";
import {DateRange} from "react-day-picker";
import {useQuery} from "@tanstack/react-query";
import {transactionService} from "@/services/transaction.service";
import {useOrganisationStore} from "@/stores/organisationStore";

/**
 * Function to retrieve and display statistics for transaction analysis chart based on selected date range and active organisation
 *
 * @returns Object with transaction analyze chart data
 */

/**
 * Retrieves the transaction summary data for the active organisation.
 *
 * This function utilizes the useOrganisationStore and useQuery hooks to fetch the transaction summary data.
 * The transaction summary data is fetched by calling the transactionService.getTransactionSummary() method using the active organisation's ID.
 * It only fetches the data if the active organisation ID is available, and the data is considered stale after 5000 milliseconds.
 *
 */
export const useTransactionSummary = () => {
    const activeOrganisation = useOrganisationStore(state => state.organisation);
    const {data: transactionSummary} = useQuery({
        queryKey: ["transaction-summary"],
        queryFn: async () => await transactionService.getTransactionSummary(activeOrganisation.organisation_id),
        enabled: !!activeOrganisation?.organisation_id,
        staleTime: 5000
    });

    return {transactionSummary};
}


/**
 * Function that retrieves transaction analyze chart data and allows user to update selected date range.
 */
export const useTransactionAnalyzeChart = () => {
    const [chartDateRangeSelected, setChartDateRangeSelected] = useState<DateRange | null>(null);
    const activeOrganisation = useOrganisationStore(state => state.organisation);

    const updateSelectedDate = (date: DateRange) => setChartDateRangeSelected(date)

    const {data: transactionAnalyzeChart} = useQuery({
        queryKey: ["transaction-analyze-chart"],
        queryFn: async ({queryKey}) => await transactionService.getTransactionAnalyzeData(activeOrganisation.organisation_id, chartDateRangeSelected),
        enabled: !!activeOrganisation?.organisation_id,
        staleTime: 5000
    });

    return {transactionAnalyzeChart, updateSelectedDate}
}