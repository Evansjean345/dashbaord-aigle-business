import {useEffect, useState} from 'react';
import {useTransactionFees} from './useTransactionFees';
import {TransactionFees} from "@/types/transaction.types";
import {FeeAccountType, FeePaymentMethod, FeeTransactionType} from "@/types/fees";


export function useCalculateFees() {
    const [debounceTimeoutId, setDebounceTimeoutId] = useState(null);
    const [fees, setFees] = useState<TransactionFees | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {isPending, calculateFees} = useTransactionFees();

    useEffect(() => {
        return () => {
            clearTimeout(debounceTimeoutId);
        }
    }, [debounceTimeoutId]);

    const calculateFeesWithPayload = (amount: string, payment_method: string, account_type: string, transaction_type: string) => {
        const feesPayload = {
            amount: parseFloat(amount),
            payment_method,
            account_type,
            transaction_type,
        }

        calculateFees(feesPayload, {
            onSuccess: async (data: TransactionFees) => {
                setFees(data);
                setError(null);
            },
            onError: async () => {
                setError("Une erreur est survenue lors du calcul des frais");
            }
        })
    }

    const handleAmountChanged = (amountSelected: string, payment_method: FeePaymentMethod, account_type: FeeAccountType, transaction_type: FeeTransactionType) => {
        if (debounceTimeoutId) {
            clearTimeout(debounceTimeoutId);
        }

        setDebounceTimeoutId(setTimeout(() => {
            calculateFeesWithPayload(amountSelected, payment_method, account_type, transaction_type);
        }, 300));
    }

    return {error, handleAmountChanged, fees, isFeePending: isPending};
}