import {Input, Spinner} from "@heroui/react";
import {CashoutTypeValue} from "@/types/transaction.types";
import Image from "next/image";
import {ActiveOrganisation} from "@/types/organisation.types";
import {ChangeEvent, useState} from "react";

interface Props {
    operator: string;
    countryId: string;
    organisation: ActiveOrganisation;
    cashoutType: CashoutTypeValue,
    handleAmountSelected: (amount: string) => void;
}

const CountryOperator = ({operator, countryId}) => (
    <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center">
            <Image
                src={`https://flagcdn.com/${countryId.toLowerCase()}.svg`}
                alt="country"
                width={40}
                height={40}
                className="rounded-md"
            />
        </div>
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
)

/**
 * Function to render Cashout amount steps component.
 * @param {Object} Props - The props object containing operator, countryId, organisation, and handleAmountSelected.
 */
export const CashoutAmountSteps = ({operator, countryId, organisation, cashoutType, handleAmountSelected}: Props) => {
    const [amount, setAmount] = useState<number>()
    const [error, setError] = useState<string | null>(null)

    /**
     * A set of validations for different transaction types.
     *
     * The validations object maps transaction types to their respective rules,
     * including a limit and an error message to be displayed if the limit is exceeded.
     *
     * Properties:
     * - `airtime_commission`: Contains validation rules for airtime commission transactions.
     *    - `limit`: Specifies the maximum allowed transaction amount for airtime commission.
     *    - `errorMsg`: Error message shown when the entered amount exceeds the airtime commission limit.
     * - `airtime_revenue`: Contains validation rules for airtime revenue transactions.
     *    - `limit`: Specifies the maximum allowed transaction amount for airtime revenue.
     *    - `errorMsg`: Error message shown when the entered amount exceeds the airtime revenue limit.
     */
    const validations: Record<string, { limit: number; errorMsg: string }> = {
        airtime_commission: {
            limit: organisation.wallet.airtimeCommission,
            errorMsg: "Le montant saisi dépasse le solde de commission smart-kbine de votre compte",
        },
        airtime_revenue: {
            limit: organisation.wallet.collect,
            errorMsg: "Le montant saisi dépasse le solde de votre compte collecte",
        },
        revenue_commission: {
            limit: organisation.wallet.commission,
            errorMsg: "Le montant saisi dépasse le solde de commission votre compte",
        },
    };

    /**
     * Handle changes to the amount input field.
     *
     * This function processes input changes for an amount field by validating
     * the entered value based on predefined rules for the current cashout type.
     * If the entered amount exceeds the permitted limit, it sets an error message
     * and nullifies the selected amount. Otherwise, it updates the amount and clears
     * any previously set errors.
     *
     * @param {Object} e - The event object from the change event.
     * @param {Object} e.target - The target element triggering the event.
     * @param {string|number} e.target.value - The new amount entered by the user.
     */
    const handleAmountChanged = (e: ChangeEvent<HTMLInputElement>): void => {
        const amountSelected = Number.parseInt(e.target.value)

        if (validations[cashoutType] && amountSelected > validations[cashoutType].limit) {
            setError(validations[cashoutType].errorMsg);
            setAmount(amountSelected);
            handleAmountSelected(null);
            return;
        }


        setAmount(amountSelected)
        setError(null)
        handleAmountSelected(amountSelected as unknown as string)
    }

    return <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Transfert vers {operator}</h3>
        <div className="bg-default-100 border p-4 rounded-lg">
            <CountryOperator countryId={countryId} operator={operator}/>
        </div>
        <Input
            label="Montant à transférer"
            placeholder="Ex: 100"
            value={String(amount)}
            type="number"
            onChange={handleAmountChanged}
            variant="bordered"
            endContent={
                <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">FCFA</span>
                </div>
            }
        />
        {error && <span className="text-red-500 text-sm font-semibold">{error}</span>}
    </div>
}