import {useMutation} from "@tanstack/react-query";
import {transactionService} from "@/services/transaction.service";
import {TransactionFees, TransactionFeesRequestPayload} from "@/types/transaction.types";

export const useTransactionFees = () => {
    const {mutate: calculateFees, isPending} = useMutation({
        mutationFn: (payload: TransactionFeesRequestPayload) => transactionService.calculateTransactionFees(payload),
        onError: (error: Error, transaction, context) => {
            console.log("error while fetching transaction fees")
        }
    });

    return {calculateFees, isPending}
}