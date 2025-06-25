import {Card, CardBody, Spinner} from "@heroui/react";
import OperatorImage from "@/components/airtimes/OperatorImage";
import {Operators} from "@/types/airtimes.types";

interface Props {
    isLoadingOperators: boolean,
    operatorSelected: string,
    operators: Operators[],
    handleOperatorSelected: (operator_id: number, operator: string) => void
}

export const OperatorsStep = ({isLoadingOperators, operators, operatorSelected, handleOperatorSelected}: Props) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Choix de l&apos;opérateur</h3>
            <div
                className={`grid gap-4 max-h-[calc(100vh-400px)] overflow-y-auto p-4  ${isLoadingOperators ? 'grid-cols-1' : 'grid-cols-2'} `}>
                {isLoadingOperators ? (
                    <div className="flex justify-center items-center  h-40">
                        <Spinner color="primary"/>
                    </div>
                ) : operators.length === 0 ? (
                    <div className="flex justify-center items-center w-full  h-40">
                        <p>Aucun opérateur disponible pour ce pays.</p>
                    </div>
                ) : operators?.map((operator) => (
                    <Card
                        key={operator.id}
                        isPressable
                        onPress={() => handleOperatorSelected(operator.operator_id, operator.operator)}
                        className={`border-2 ${operatorSelected === operator.operator ? 'border-primary bg-primary-100' : 'border-transparent'}`}
                    >
                        <CardBody className="flex flex-col items-center p-4">
                            <OperatorImage operator={operator}/>
                            <span className="text-sm font-medium">{operator.operator}</span>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    )
}