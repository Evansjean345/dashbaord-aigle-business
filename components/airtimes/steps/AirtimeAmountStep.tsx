import {Input} from "@heroui/react";
import {UseFormRegister} from "react-hook-form";
import {rechargePayload} from "@/types/airtimes.types";

interface Props {
    handleNumberChange: (value: string) => void;
    handleAmountChange: (value: string) => void;
    register: UseFormRegister<rechargePayload>
}

export const AirtimeAmountStep = ({register, handleAmountChange, handleNumberChange}: Props) => {
    return (
        <>
            <Input
                {...register('amount', {required: true})}
                type="number"
                label="Montant"
                variant="bordered"
                isRequired
                endContent={<span className="text-default-400">FCFA</span>}
                onChange={(e) => handleAmountChange(e.target.value)}

            />
            <Input
                {...register("receiver.phone_number", {required: true})}
                label="Numéro du bénéficiaire"
                variant="bordered"
                isRequired
                onChange={(e) => handleNumberChange(e.target.value)}
            />
        </>
    )
}