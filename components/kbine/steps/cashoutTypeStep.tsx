import {CashoutType} from "@/types/transaction.types";
import {Card, CardBody} from "@heroui/react";

interface CashoutTypeProps {
    cashoutTypeList: CashoutType[];
    cashoutTypeSelected: string;
    handleSelected: (cashoutType: string) => void;
}

/**
 * Renders a step for selecting a cashout type.
 * @param {Object} CashoutTypeProps - The props for the component.
 * @param {Object} CashoutTypeProps.cashoutTypeSelected - The selected cashout type.
 * @param {Array} CashoutTypeProps.cashoutTypeList - The list of cashout types to choose from.
 * @param {Function} CashoutTypeProps.handleSelected - The callback function to handle selected cashout type.
 */
export const CashoutTypeStep = ({cashoutTypeSelected, cashoutTypeList, handleSelected}: CashoutTypeProps) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Type de fonds à rétirer</h3>
            <div className="grid grid-cols-1 gap-4">
                {cashoutTypeList.map(item => (
                    <Card
                        key={item.value}
                        isPressable
                        onPress={() => handleSelected(item.value)}
                        className={`border-2 ${
                            cashoutTypeSelected === item.value
                                ? "border-primary bg-primary-100"
                                : "border-transparent"
                        }`}
                    >
                        <CardBody className="p-4">
                            <span className="font-medium">{item.label}</span>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}