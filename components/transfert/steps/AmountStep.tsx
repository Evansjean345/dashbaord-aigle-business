import React, {useEffect, useMemo, useState} from "react";
import {Input, Spinner} from "@heroui/react";
import {TransactionFees} from "@/types/transaction.types";
import {useTransactionFees} from "@/hooks/useTransactionFees";
import Image from "next/image";
import {ActiveOrganisation} from "@/types/organisation.types";
import {useDebounce} from "@/hooks/useDebounce";

interface Props {
    operator: string;
    countryId: string;
    currentAmount?: string
    currentFees?: TransactionFees;
    organisation: ActiveOrganisation;
    handleFeesSelected: (fees: TransactionFees) => void;
    handleAmountSelected: (amount: string) => void;
}

const CountryOperator = ({operator, countryId}) => (
    <div className="flex items-center justify-center gap-4">
        <Image
            src={`https://flagcdn.com/${countryId.toLowerCase()}.svg`}
            alt="country"
            width={40}
            height={40}
            className="rounded-md"
        />
        <div className="flex flex-col items-center">
            <Image
                src={`/img/${operator}.png`}
                alt="Network"
                width={40}
                height={40}
                className="rounded-md"
            />
            <span className="text-sm mt-1">{operator}</span>
        </div>
    </div>
);

const TransferDetails = ({isPending, fees}) => (
    <div className="bg-neutral-100/50 dark:bg-secondary border p-4 rounded-lg space-y-2">
        {isPending ? (
            <div className="flex items-center justify-center">
                <Spinner size="sm" label="Calcul des frais..."/>
            </div>
        ) : (
            <>
                <div className="text-blue-600 text-sm flex justify-between">
                    <span className="font-bold">Frais :</span>
                    <span className="font-bold">{fees?.feesAmount || 0} FCFA</span>
                </div>
                <div className="text-neutral-800 dark:text-white text-sm flex justify-between">
                    <span className="font-bold">Montant à recevoir :</span>
                    <span className="font-bold">{fees?.finalAmount || 0} FCFA</span>
                </div>
            </>
        )}
    </div>
);

export const AmountSteps = ({
                                operator,
                                countryId,
                                currentAmount = "",
                                currentFees = null,
                                organisation,
                                handleAmountSelected,
                                handleFeesSelected,
                            }: Props) => {
    const [amount, setAmount] = useState(currentAmount);
    const [fees, setFees] = useState<TransactionFees | null>(currentFees);
    const [error, setError] = useState<string | null>(null);
    const debouncedAmount = useDebounce(amount, 300);

    const {isPending, calculateFees} = useTransactionFees();

    const feesPayload = useMemo(
        () => ({
            amount: debouncedAmount,
            payment_method: "mobile-money",
            account_type: organisation.account_type,
            transaction_type: "payout",
        }),
        [debouncedAmount, organisation.account_type]
    );

    useEffect(() => {
        if (!debouncedAmount || parseInt(debouncedAmount) > organisation.wallet.balance) {
            setFees(null);
            handleFeesSelected(null);
            return;
        }

        calculateFees(feesPayload, {
            onSuccess: (data) => {
                setFees(data);
                setError(null);
                handleFeesSelected(data);
            },
            onError: () => {
                setFees(null);
                setError("Erreur lors du calcul des frais");
            },
        });
    }, [debouncedAmount]);

    const handleAmountChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const amountValue = e.target.value;

        setAmount(amountValue);
        handleAmountSelected(amountValue);

        if (parseInt(amountValue) > organisation.wallet.balance) {
            setError("Montant supérieur au solde disponible");
            setFees(null);
            handleFeesSelected(null);
        } else {
            setError(null);
        }
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Transfert vers {operator}</h3>

            <div className="bg-default-100 border p-4 rounded-lg">
                <CountryOperator countryId={countryId} operator={operator}/>
            </div>

            <Input
                label="Montant à transférer"
                placeholder="Ex: 100"
                value={amount}
                onChange={handleAmountChanged}
                variant="bordered"
                endContent={<span className="text-default-400 text-small">FCFA</span>}
            />

            {error && <span className="text-red-500 text-sm font-semibold">{error}</span>}

            <TransferDetails isPending={isPending} fees={fees}/>
        </div>
    );
};
