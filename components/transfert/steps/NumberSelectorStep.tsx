import {Input} from "@heroui/react";

interface Props {
    destinationNumber: string
    label?: string,
    handleDestinationNumberChange: (destinationNumber: string) => void
}

export const NumberSelectorStep = ({
                                       destinationNumber,
                                       handleDestinationNumberChange,
                                       label = "Numéro à créditer"
                                   }: Props) => {
    return <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">{label}</h3>
        <Input
            label="Votre numéro"
            maxLength={10}
            minLength={10}
            type="number"
            placeholder="Ex: 0700000000"
            value={destinationNumber}
            onChange={(e) => handleDestinationNumberChange(e.target.value)}
            variant="bordered"
        />
    </div>
}